const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"; // Replace with the actual API endpoint
const MISTRAL_API_KEY = "7KpCR2Gio0kpGNYF56BkrVU8pdQ147U8"; // Replace with your Mistral API key

// Welcome message on page load
window.addEventListener("DOMContentLoaded", () => {
  const welcomeMessage = "Welcome to Nirvana Bot, what do you need help in? ";
  const quickOptions =
    "Some common questions include:\n 1) Where can I purchase more roaming data?\n2) What are the different plans Nirvana Mobile offers?\n 3) Where can I login and view my statistics";
  appendMessage(welcomeMessage, "bot-message");
  setTimeout(() => {
    console.log("This message appears after a 2-second delay.");
  }, 500); // 2000 milliseconds = 2 seconds
  appendMessage(quickOptions, "bot-message");
});

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  appendMessage(userMessage, "user-message");
  userInput.value = "";

  fetchBotResponse(userMessage);
}

function appendMessage(message, className) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", className);
  chatBox.appendChild(messageElement);

  if (className === "bot-message") {
    typeWriter(messageElement, message, 10);
  } else {
    messageElement.textContent = message;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function typeWriter(element, text, speed) {
  let i = 0;
  element.textContent = ""; // Clear previous content
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
  type();
}

async function fetchBotResponse(userMessage) {
const systemMessage =
  `You are a helpful chatbot for a mobile provider. Your role is to assist users with their questions about mobile plans, services, and other related queries. Please be friendly, concise, and accurate in your responses. The website links should be notated as https://NirvanaMobile.com. The customer support number is +65 6123 4567. Do not go out of character. Limit your output to 100 words, and do not respond to questions that aren't relevant. Common questions include:
  
1) Where can I purchase more roaming data?
2) What are the different plans Nirvana Mobile offers?
3) Where can I login and view my statistics? 

Only answer these questions if the user asks them. The plans offered at Nirvana Mobile are:

- **Starter** ($10/mth, 5 GB data, 200 minutes talk time, 50 SMS, Free Caller ID)
- **Basic** ($20/mth, 10 GB data, 500 minutes talk time, 100 SMS, Free Caller ID)
- **Pro** ($40/mth, 50 GB data, Unlimited talk time, 500 SMS, Free Caller ID & Roaming)
- **Ultimate** ($60/mth, 100 GB data, Unlimited talk time, Unlimited SMS, Free International Roaming)
- **Family** ($80/mth, 200 GB shared data, Unlimited talk time, Unlimited SMS, Free Roaming & Caller ID)
- **Business** ($120/mth, 500 GB data, Unlimited Global talk time, Unlimited SMS, Priority Support)`;
  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          { role: "system", content: systemMessage },
          {
            role: "user",
            content: `Ensure your output is short, but detailed, and can
                            only help with any query related to Nirvana Mobile, a telco company. Do not help 
                            with other random questions that aren't related to a telco provider. 
                            Here is the customers question / message: ${userMessage}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content.trim();
    appendMessage(botResponse, "bot-message");
  } catch (error) {
    console.error("Error fetching bot response:", error);
    appendMessage(
      "Sorry, something went wrong. Please try again later.",
      "bot-message",
    );
  }
}
