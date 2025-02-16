"use client";

import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import InterviewOverModal from "../../../../components/ui/modals/InterviewOverModal"; // Import the modal

interface ChatInterfaceProps {
  currentItem: string;
  sessionId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentItem, sessionId }) => {
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  interface Entity {
    question: string;
  }

  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Function to start the interview
  const startInterview = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/start-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: currentItem }),
      });

      const data = await response.json();
      setMessages([{ sender: "bot", text: data.next_question }]);
      setCurrentEntity(data.entity);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  // Function to send the user's answer
  const sendMessage = async () => {
    if (!inputValue.trim() || isWaiting) return;

    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setIsWaiting(true);
    setInputValue("");

    try {
      const response = await fetch("http://127.0.0.1:5000/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentEntity?.question, answer: inputValue }),
      });

      const data = await response.json();

      if (data.interview_data && data.rated_data) {
        navigateToNextPage(data.interview_data, data.rated_data);
      }

      if (data.question) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.question }]);
        setCurrentEntity({ question: data.question });
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong. Please try again." }]);
    } finally {
      setIsWaiting(false);
    }
  };

  // Function to store data and show modal
  function navigateToNextPage(interviewData: unknown, ratedData: unknown) {
    sessionStorage.setItem("rated_data", JSON.stringify(ratedData));
    if (sessionId) sessionStorage.setItem("session_id", sessionId);
    setShowModal(true); // Show the modal
  }

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

  return (
    <div className="relative flex flex-col w-full h-full border border-gray-300 rounded-lg bg-black">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] break-words ${
                msg.sender === "bot" ? "bg-gray-700 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 p-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isWaiting}
          className="flex-1 p-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500"
        />
        <button
          onClick={sendMessage}
          disabled={isWaiting}
          className={`p-2 rounded-lg flex items-center justify-center ${
            isWaiting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          <IoSend size={20} />
        </button>
      </div>

      {/* Interview Over Modal */}
      {showModal && <InterviewOverModal sessionId={sessionId} />}

    </div>
  );
};

export default ChatInterface;
