"use client";

import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";

interface ChatInterfaceProps {
  currentItem: string; // Accept currentItem as a prop
  sessionId: string | null; // Accept sessionId as a prop
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentItem, sessionId }) => {
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentEntity, setCurrentEntity] = useState<any | null>(null);
  const [isWaiting, setIsWaiting] = useState(false); // Track whether waiting for bot's response
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Toast message

  // Function to show a toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null); // Automatically hide the toast after 2 seconds
    }, 2000);
  };

  // Function to start the interview
  const startInterview = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: currentItem,
        }),
      });

      const data = await response.json();

      // Display the first static question from the response
      setMessages([{ sender: "bot", text: data.next_question }]);

      // Store the current entity to continue tracking the conversation
      setCurrentEntity(data.entity);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  // Function to send the user's answer
  const sendMessage = async () => {
    if (!inputValue.trim() || isWaiting) return; // Prevent sending if waiting or input is empty

    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setIsWaiting(true); // Set waiting state to true
    setInputValue(""); // Clear the input field

    try {
      // First check the response for tone/comprehensibility
      const checkResponse = await fetch("http://127.0.0.1:5000/check-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentEntity?.question,
          response: inputValue,
        }),
      });

      const checkData = await checkResponse.json();

      if (checkData.error) {
        throw new Error(checkData.error);
      }

      // IMPLEMENT CHECK TONE AND COMPREHENSIBILITY

      const response = await fetch("http://127.0.0.1:5000/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentEntity?.question,
          answer: inputValue,
        }),
      });

      const data = await response.json();

      if (data.interview_data) {
        navigateToNextPage(data.interview_data); // Pass sessionId to next page
      }

      // Add the bot's next question to the chat
      if (data.question) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.question }]);
      }

      // Update the current entity with the new entity from the response
      if (data.entity) {
        setCurrentEntity(data.entity);
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsWaiting(false); // Reset waiting state
    }
  };

  // Automatically start the interview when the component loads
  useEffect(() => {
    if (currentItem) {
      startInterview();
    }
  }, [currentItem]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  function navigateToNextPage(interviewData: JSON) {
    if (sessionId) {
      // Send interview data and sessionId to the next page
      window.location.href = `/review?session=${sessionId}`; // Example navigation to a review page with sessionId
    } else {
      window.location.href = "/review"; // Redirect without sessionId if not available
    }
  }

  return (
    <div className="relative flex flex-col w-full h-full border border-gray-300 rounded-lg bg-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] break-words ${
                msg.sender === "bot" ? "bg-gray-700 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Add Typing component if waiting */}
        {isWaiting && (
          <div className="mb-3 flex justify-start">
            <div className="inline-block p-3 rounded-lg max-w-[80%] bg-gray-700 text-white">
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
              <div className="typing__dot"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 p-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress} // Handle Enter key
          onPaste={(e) => {
            e.preventDefault(); // Disable paste
            showToast("Pasting is not allowed.");
          }}
          onCopy={(e) => {
            e.preventDefault(); // Disable copy
            showToast("Copying is not allowed.");
          }}
          disabled={isWaiting} // Disable input while waiting for bot's response
          className="flex-1 p-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          disabled={isWaiting} // Disable button while waiting for bot's response
          className={`p-2 rounded-lg flex items-center justify-center ${
            isWaiting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
