"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import InterviewOverModal from "../../../../components/ui/modals/InterviewOverModal";
import InterviewEndConfirmation from "../../../../components/ui/modals/InterviewEndConfirmation";

interface ChatInterfaceProps {
  currentItem: string;
  sessionId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentItem,
  sessionId,
}) => {
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false); // New state for confirmation modal
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Toast message
  const [terminateInterview, setTerminateInterview] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const clientTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interviewStartTimeRef = useRef<Date | null>(null);
  const interviewDurationRef = useRef<number | null>(null);

  interface Entity {
    question: string;
  }
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update client-side timer
  const updateClientTimer = useCallback(() => {
    if (!interviewStartTimeRef.current || !interviewDurationRef.current) return;

    const now = new Date();
    const elapsedMilliseconds =
      now.getTime() - interviewStartTimeRef.current.getTime();
    const elapsedSeconds = elapsedMilliseconds / 1000;
    const durationSeconds = interviewDurationRef.current * 60; // Convert minutes to seconds
    const remaining = Math.max(0, durationSeconds - elapsedSeconds);

    setRemainingTime(remaining);

    // End interview if client timer reaches zero
    if (remaining <= 0) {
      console.log("Client timer indicates time's up! Ending interview...");
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current);
      }
      setTerminateInterview(true);
    }
  }, []);

  // // Check remaining time with server (less frequent)
  // const checkRemainingTimeWithServer = useCallback(async () => {
  //   try {
  //     const response = await fetch(
  //       "http://127.0.0.1:5000/interview/check-time",
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Update the timer with the server time
  //       setRemainingTime(data.remaining_time);

  //       // Re-sync our client timer with server time
  //       if (interviewStartTimeRef.current && interviewDurationRef.current) {
  //         const now = new Date();
  //         const serverRemainingSeconds = data.remaining_time;
  //         const totalDurationSeconds = interviewDurationRef.current * 60;
  //         const elapsedSeconds = totalDurationSeconds - serverRemainingSeconds;

  //         // Calculate when the interview must have started according to server time
  //         const adjustedStartTime = new Date(
  //           now.getTime() - elapsedSeconds * 1000
  //         );
  //         interviewStartTimeRef.current = adjustedStartTime;
  //       }

  //       // End interview if server says time is up
  //       if (data.end_interview) {
  //         console.log("Server confirms time's up! Ending interview...");
  //         setTerminateInterview(true);
  //       }
  //     } else {
  //       console.error("Error checking time:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error checking time:", error);
  //   }
  // }, []);

  // Start the interview
  const startInterview = useCallback(async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/interview/start-interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, job: currentItem }), // Send the sessionid to the backend
        }
      );

      const data = await response.json();
      setMessages([{ sender: "bot", text: data.next_question }]);
      setCurrentEntity(data.entity);

      // Set initial timer (assuming the backend returns initial duration in seconds)
      const initialDurationSeconds = data.remaining_time || 1800; // Default 30 minutes if not provided
      const initialDurationMinutes = initialDurationSeconds / 60;

      setRemainingTime(initialDurationSeconds);
      interviewStartTimeRef.current = new Date();
      interviewDurationRef.current = initialDurationMinutes;

      // Start client-side timer (updates every second)
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current);
      }
      clientTimerRef.current = setInterval(updateClientTimer, 1000);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  }, [currentItem, sessionId, updateClientTimer]); // Add dependencies

  // Handle sending user message
  const sendMessage = async () => {
    if (!inputValue.trim() || isWaiting) return;

    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setIsWaiting(true);
    setInputValue("");

    try {
      const response = await fetch("http://127.0.0.1:5000/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId, // Send the sessionid to the backend
          question: currentEntity?.question,
          answer: inputValue,
        }),
      });

      const data = await response.json();

      // Log interview_data and rated_data for debugging
      console.log("Received interview_data:", data.interview_data);
      console.log("Received rated_data:", data.rated_data);

      if ((data.interview_data && data.rated_data) || terminateInterview) {
        navigateToNextPage(data.interview_data, data.rated_data);
      }

      if (data.question) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.question },
        ]);
        setCurrentEntity({ question: data.question });
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  const showToast = (message: string) => {
    console.log("Toast message:", toastMessage); // Debugging
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null); // Automatically hide the toast after 2 seconds
    }, 2000);
  };

  function navigateToNextPage(interviewData: unknown, ratedData: unknown) {
    sessionStorage.setItem("rated_data", JSON.stringify(ratedData));
    if (sessionId) sessionStorage.setItem("session_id", sessionId);

    console.log("Stored Data:", sessionStorage.getItem("rated_data"));
    setShowModal(true);
  }

  useEffect(() => {
    if (currentItem) {
      startInterview();
    }

    // Cleanup timer on unmount
    return () => {
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current);
      }
    };
  }, [currentItem, startInterview]);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Listen for Alt+E to open the confirmation modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "e") {
        setShowEndConfirmation(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle key press for sending messages
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (terminateInterview) {
      // Clear both timers
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current);
      }
      // if (serverCheckTimerRef.current) {
      //   clearInterval(serverCheckTimerRef.current);
      // }

      fetch("http://127.0.0.1:5000/interview/terminate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Terminate response:", data.message);

          // Now send the termination request to /answer
          return fetch("http://127.0.0.1:5000/interview/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionId, // Include session ID
              question: "Termination request",
              answer: "[INTERVIEW_TERMINATED]",
            }),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("Final interview response:", data);

          if (data.interview_data && data.rated_data) {
            navigateToNextPage(data.interview_data, data.rated_data);
          } else {
            console.warn("Missing interview_data or rated_data.");
          }

          // Show the interview over modal
          setShowModal(true);
        })
        .catch((error) => {
          console.error("Error in termination sequence:", error);
        });
    }
  }, [terminateInterview]);

  return (
    <div className="flex w-full h-full">
      <div className="relative flex flex-col flex-1 border border-gray-300 rounded-b-lg bg-black">
        {/* Timer display */}
        {remainingTime !== null && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <FaClock size={16} />
            <span>{formatTime(remainingTime)}</span>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 max-h-[800px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] break-words ${
                  msg.sender === "bot"
                    ? "bg-gray-700 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 p-3 bg-black border-t border-gray-700 mt-auto">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onPaste={(e) => {
              e.preventDefault(); // Disable paste
              showToast("Pasting is not allowed.");
            }}
            onCopy={(e) => {
              e.preventDefault(); // Disable copy
              showToast("Copying is not allowed.");
            }}
            onCut={(e) => {
              e.preventDefault(); // Disable copy
              showToast("Cutting is not allowed.");
            }}
            disabled={isWaiting}
            className="flex-1 p-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            disabled={isWaiting}
            className={`p-2 rounded-lg flex items-center justify-center ${
              isWaiting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            <IoSend size={20} />
          </button>
        </div>
        {/* Toast message */}
        {toastMessage && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg">
            {toastMessage}
          </div>
        )}
      </div>

      {showModal && <InterviewOverModal sessionId={sessionId} />}
      {showEndConfirmation && (
        <InterviewEndConfirmation
          onClose={() => setShowEndConfirmation(false)}
          onConfirm={() => setTerminateInterview(true)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
