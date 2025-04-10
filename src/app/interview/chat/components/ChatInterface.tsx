"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import InterviewOverModal from "../../../../components/ui/modals/InterviewOverModal";
import InterviewEndConfirmation from "../../../../components/ui/modals/InterviewEndConfirmation";
import { API_BASE_URL } from "@/utils/config";

interface ChatInterfaceProps {
  currentItem: string;
  sessionId: string | null;
  isFullscreen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentItem,
  sessionId,
  isFullscreen,
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
  const [isTimerPaused, setIsTimerPaused] = useState(false); // New state for timer pause status
  const [isTerminating, setIsTerminating] = useState(false);

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
  useEffect(() => {
    console.log("api base url", API_BASE_URL); // Debugging
  }, []); // Debugging
  // Effect to handle visibility change (Alt+Tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsTimerPaused(true);
      } else {
        setIsTimerPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Effect to handle fullscreen changes from parent
  useEffect(() => {
    setIsTimerPaused(!isFullscreen);
  }, [isFullscreen]);

  // Effect to pause timer when interview completes
  useEffect(() => {
    if (terminateInterview) {
      setIsTimerPaused(true);
    }
  }, [terminateInterview]);

  // Effect to manage timer interval based on pause status
  useEffect(() => {
    if (isTimerPaused) {
      // Pause the timer
      if (clientTimerRef.current) {
        clearInterval(clientTimerRef.current);
        clientTimerRef.current = null;
      }
    } else {
      // Resume the timer with adjusted start time
      if (
        interviewStartTimeRef.current !== null &&
        remainingTime !== null &&
        interviewDurationRef.current !== null
      ) {
        const totalDurationSeconds = interviewDurationRef.current * 60;
        const elapsedSeconds = totalDurationSeconds - remainingTime;
        interviewStartTimeRef.current = new Date(
          Date.now() - elapsedSeconds * 1000
        );
        clientTimerRef.current = setInterval(updateClientTimer, 1000);
      }
    }
  }, [isTimerPaused, remainingTime, updateClientTimer]);

  // Start the interview
  const startInterview = useCallback(async () => {
    try {
      if (!sessionId) {
        console.error("No sessionId available!");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/interview/start-interview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, job: currentItem }), // ✅ Use session_id
        }
      );

      const data = await response.json();

      setMessages([{ sender: "bot", text: data.next_question }]);
      setCurrentEntity(data.entity);

      // Set initial timer (assuming the backend returns initial duration in seconds)
      const initialDurationSeconds = data.remaining_time || 900; // Default 30 minutes if not provided
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
      const response = await fetch(`${API_BASE_URL}/interview/answer`, {
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
      // console.log("Received interview_data:", data.interview_data);
      // console.log("Received rated_data:", data.rated_data);

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

  const navigateToNextPage = useCallback(
    (interviewData: unknown, ratedData: unknown) => {
      sessionStorage.setItem("rated_data", JSON.stringify(ratedData));
      if (sessionId) sessionStorage.setItem("session_id", sessionId);

      console.log("Stored Data:", sessionStorage.getItem("rated_data"));
      setShowModal(true);
    },
    [sessionId, setShowModal] // Dependencies
  );
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
    // Only proceed if we should terminate and we're not already in the process of terminating
    if (terminateInterview && !isTerminating) {
      setIsTerminating(true); // Set flag to prevent repeated calls
    console.log("Starting termination process...");

      // Make a single API call to /answer with terminate flag
      fetch(`${API_BASE_URL}/interview/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question: currentEntity?.question || "Interview terminated",
          answer: "iqoertj;nqwej;oqw",
          terminate: true,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Final interview response:", data); // Debugging

          if (data.interview_data && data.rated_data) {
            navigateToNextPage(data.interview_data, data.rated_data);
          } else {
            console.error("Missing interview_data or rated_data:", data);
          }

          // Show the interview over modal
          setShowModal(true);

          // Reset the termination flags to prevent further API calls
          setTerminateInterview(false);
        })
        .catch((error) => {
          console.error("Error in termination sequence:", error);
          // Reset flags on error too
          setIsTerminating(false);
          setTerminateInterview(false);
        });
    }
  }, [
    navigateToNextPage,
    sessionId,
    terminateInterview,
    currentEntity,
    isTerminating,
  ]);
  // useEffect(() => {
  //   if (terminateInterview) {
  //     fetch(`${API_BASE_URL}/interview/terminate-interview`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ session_id: sessionId }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Terminate response:", data.message); // Debugging

  //         // Now send the termination request to /answer
  //         return fetch(`${API_BASE_URL}/interview/answer`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             session_id: sessionId,
  //             question: currentEntity?.question || "Interview terminated",
  //             answer: "",
  //             terminate: true,
  //           }),
  //         });
  //       })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Final interview response:", data); // Debugging

  //         if (data.interview_data && data.rated_data) {
  //           navigateToNextPage(data.interview_data, data.rated_data);
  //         } else {
  //           console.warn("Missing interview_data or rated_data.");
  //         }

  //         // Show the interview over modal
  //         setShowModal(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error in termination sequence:", error);
  //       });
  //   }
  // }, [navigateToNextPage, sessionId, terminateInterview, currentEntity]);

  return (
    <div className="flex w-full h-full">
      <div className="relative flex flex-col flex-1 max-w-7xl mx-auto bg-backgroundgray rounded-xl shadow-xl overflow-hidden border border-gray-500">
        {/* Timer display */}
        {remainingTime !== null && (
          <div className="absolute top-4 right-4 bg-gray-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 z-10 shadow-md">
            <FaClock className="text-blue-400" size={16} />
            <span className="font-medium">{formatTime(remainingTime)}</span>
          </div>
        )}
  
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl break-words transition-all duration-200 ${
                  msg.sender === "bot"
                    ? "bg-gray-700/80 text-foreground hover:bg-gray-700"
                    : "bg-blue-600 text-foreground hover:bg-blue-700"
                } ${
                  msg.sender === "bot" ? "rounded-tl-none" : "rounded-br-none"
                } shadow-md`}
              >
                <p className="text-gray-100 leading-relaxed hyphens-auto">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Input area */}
        <div className="p-4 bg-backgroundgray border-t border-gray-700 backdrop-blur-sm">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={(e) => {
                e.preventDefault();
                showToast("Pasting is not allowed.");
              }}
              onCopy={(e) => {
                e.preventDefault();
                showToast("Copying is not allowed.");
              }}
              onCut={(e) => {
                e.preventDefault();
                showToast("Cutting is not allowed.");
              }}
              disabled={isWaiting}
              className="flex-1 px-5 py-3 border border-gray-700 rounded-xl bg-background text-foreground placeholder-gray-500 
                        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={isWaiting}
              className={`p-3 rounded-xl flex items-center justify-center transition-all
                ${
                  isWaiting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                }`}
            >
              <IoSend className="text-white" size={20} />
            </button>
          </div>
        </div>
  
        {/* Toast message */}
        {toastMessage && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-lg 
                          animate-fade-in-up shadow-lg">
            {toastMessage}
          </div>
        )}
  
        {/* Modals */}
        {showModal && <InterviewOverModal sessionId={sessionId} />}
        {showEndConfirmation && (
          <InterviewEndConfirmation
            onClose={() => setShowEndConfirmation(false)}
            onConfirm={() => {
              setShowEndConfirmation(false);
              setTerminateInterview(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
