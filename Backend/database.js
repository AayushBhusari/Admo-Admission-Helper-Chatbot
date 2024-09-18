const { MongoClient, ServerApiVersion } = require("mongodb");

// Update with your database name
const uri =
  "mongodb+srv://aybh299:testForSIHat2024@testsih.ojvu8.mongodb.net/collegeData";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = new MongoClient(uri, options);
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message);
      throw new Error("MongoDB Connection Error");
    }
  }
  return client;
};

const getConnectedClient = () => {
  if (!client) {
    throw new Error("MongoDB client not initialized");
  }
  return client;
};

module.exports = { connectToMongoDB, getConnectedClient };
