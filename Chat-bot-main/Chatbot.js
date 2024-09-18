document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const newInquiry = document.getElementById("newInquiry");
  const chatBox = document.getElementById("chatBox");
  const signIn = document.getElementById("signIn");
  const loginModal = document.getElementById("loginModal");
  const sendButton = document.getElementById("sendButton");
  const userInput = document.getElementById("userInput");
  const shareChat = document.getElementById("shareChat");

  // New Inquiry button to clear chat and start a new chat
  newInquiry.addEventListener("click", function () {
    chatBox.innerHTML =
      '<div class="chat-message bot-message">Hello! How can I assist you today?</div>';
  });

  // Handle chat send button
  sendButton.addEventListener("click", function () {
    sendMessage();
  });

  // Handle Enter key press for sending message
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      sendMessage();
    }
  });

  async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText !== "") {
      chatBox.innerHTML += `<div class="chat-message user-message">${userText}</div>`;
      userInput.value = "";

      // Scroll to the bottom of the chat
      chatBox.scrollTop = chatBox.scrollHeight;

      // Send user query to backend
      try {
        const response = await fetch("http://localhost:5000/chatbot/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userText }),
        });

        // Get the response from backend and parse it as JSON
        const data = await response.json();

        console.log("Gemini API Response:", data); // Log response for debugging
        let parsedResp = data.result;
        // Display bot response in chat
        const botResponse = `${parsedResp}`;
        console.log(parsedResp);
        chatBox.innerHTML += `<div class="chat-message bot-message">${botResponse}</div>`;
      } catch (error) {
        // Handle errors (e.g., network issues)
        console.log(error);
        chatBox.innerHTML += `<div class="chat-message bot-message">Error: Unable to reach the server.</div>`;
      }

      // Scroll to the bottom again after bot response
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  // Handle share chat
  shareChat.addEventListener("click", function () {
    const chatContent = chatBox.innerHTML;
    const blob = new Blob([chatContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.html";
    a.click();
    URL.revokeObjectURL(url);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  // Open and close sidebar
  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("show");
  });

  // Close sidebar when clicking outside of it
  document.body.addEventListener("click", function (e) {
    if (
      sidebar.classList.contains("show") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("show");
    }
  });

  // Prevent closing sidebar when clicking inside it
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});
