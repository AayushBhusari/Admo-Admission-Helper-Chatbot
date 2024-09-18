const express = require("express");
const { connectToMongoDB } = require("./database");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: "*",
  })
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB connection and collection setup
let db, collegesCollection;

async function setupMongoDB() {
  const client = await connectToMongoDB();
  db = client.db("collegeData");
  collegesCollection = db.collection("colleges");
}

async function executeMongoDBQuery(recievedQuery) {
  console.log(typeof recievedQuery, " Received query:", recievedQuery);

  try {
    // Extract the collection name, filter, and projection from the query string
    const regex = /db\.(\w+)\.findOne\((.*?),\s*(.*?)\)/;
    const match = recievedQuery.match(regex);

    if (!match) {
      throw new Error("Invalid query string format");
    }

    const collectionName = match[1];
    let filterString = match[2].replace(/'/g, '"'); // Replace single quotes with double quotes
    let projectionString = match[3].replace(/'/g, '"'); // Replace single quotes with double quotes

    // Ensure valid JSON format by adding double quotes around property names
    filterString = filterString.replace(/(\w+):/g, '"$1":'); // Add quotes around property names
    projectionString = projectionString.replace(/(\w+):/g, '"$1":'); // Add quotes around property names

    // Parse the filter and projection strings into objects
    const filter = JSON.parse(filterString);
    const projection = JSON.parse(projectionString);

    // Execute the query
    const collection = db.collection(collectionName);
    const data = await collection.findOne(filter, { projection });

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

/* const { MongoClient } = require('mongodb');

async function executeMongoDBQuery(recievedQuery, connectionString) {
  console.log(typeof recievedQuery, " Received query:", recievedQuery);

  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db();

  
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await client.close();
  }
}

// Example usage
const queryString = "db.colleges.findOne({ name: 'G H Raisoni College on Engineering' }, { 'Fee Structure': 1, _id: 0 })";
const connectionString = "mongodb://localhost:27017";

executeMongoDBQuery(queryString, connectionString)
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error)); */

// Route for chatbot to send queries
app.post("/chatbot/query", async (req, res) => {
  const userQuery = req.body.query;

  try {
    // Step 1: Send the user's question to Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const baseQuery = `I have a MongoDB collection called 'colleges' with documents structured as follows:

{
  'name': 'College Name',
  'Branches': ['List of branches'],
  'Fee Structure': 'Fee description',
  'Placement Details': {
    'Recruiters': ['List of recruiters'],
    'Details': 'Placement details'
  },
  'Cutoff': {
    'Branch Name': 'Cutoff percentage'
  },
  'Competitive Exams': ['List of exams'],
  'Ratings': {
    'Infrastructure': rating,
    'Placement': rating,
    'Hostel Facilities': rating
  },
  'Contact Info': {
    'Email': 'Contact email',
    'Website': 'Website URL',
    'Contact No': 'Contact number'
  }
}

Please generate a MongoDB query based on the user's input query. The user will provide a natural language question about the college data.

Your task is to provide a query that would be used to find the relevant data from this structure using JavaScript. Do not include any additional text or explanation, just the query. Don't even include the language name or anything like that. Send me the query in plain text format.
The user's query is: `;

    const queryForGemini = baseQuery + userQuery;
    const result = await model.generateContent(queryForGemini);

    // Step 2: Extract the MongoDB query from the Gemini response and format it
    let geminiSuggestedQuery =
      result.response.candidates[0].content.parts[0].text;

    if (!geminiSuggestedQuery) {
      return res.status(400).json({
        message: "Could not extract a valid query from the Gemini response.",
      });
    }

    // Clean up the query string
    geminiSuggestedQuery = geminiSuggestedQuery
      .trim()
      .substring(13, geminiSuggestedQuery.length - 3); // Remove leading and trailing whitespace and md stuff

    console.log("Cleaned query:", geminiSuggestedQuery);

    // Optionally, replace certain characters or patterns if known
    // geminiSuggestedQuery = geminiSuggestedQuery.replace(/some-pattern/, 'replacement');

    try {
      // If the query is not JSON, it may need to be manually formatted or validated
      let queryRes = null;
      let i = 0;
      while (queryRes == null && i < 100) {
        queryRes = await executeMongoDBQuery(geminiSuggestedQuery);
        i++;
        setTimeout(() => {
          console.log("Waiting for correct response ", i, " iterations done");
        }, 1000);
      }
      if (i > 100) {
        return console.error("100 attempts done, retry");
      }
      /* let queryRes = await executeMongoDBQuery(geminiSuggestedQuery); */
      if (queryRes == null) {
        console.error("Gemini maa ka lauda");
        return res.json({
          result: "gemini error",
        });
      }

      let nextQuery = `I am making a talk with database app. The user question was ${userQuery} and what I found from the database was ${JSON.stringify(
        queryRes,
        null,
        2
      )}, now craft the answer for the user in natural language answering their query`;
      console.log(nextQuery);
      let resp = await model.generateContent(nextQuery);
      resp = resp.response.candidates[0].content.parts[0].text;
      console.log(resp);

      // Step 4: Send the data as a JSON response
      res.json({
        result: resp, // The data returned from the MongoDB collection
      });
    } catch (error) {
      console.error("Error processing query:", error);
      res.status(500).json({
        message: "There was an error processing your request.",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "There was an error processing your request.",
      error: error.message,
    });
  }
});

// Initialize MongoDB connection and start the server
async function startServer() {
  await setupMongoDB();
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
