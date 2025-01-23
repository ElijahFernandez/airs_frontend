"use client";

import React, { useEffect, useState } from "react";
import MultiStepComponent from "./components/multistepcomponent";
import { AiOutlineHome } from "react-icons/ai"; // Import the Home icon

const Onboarding = () => {
  const [sessionId, setSessionId] = useState<string | null>(null); // Explicitly type the state

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    setSessionId(session); // session can be a string or null
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Home Icon Button */}
      <div>
        <button
          className="fixed top-6 left-6 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 shadow"
          onClick={() => {
            window.location.href = "/"; // Redirect to the home page
          }}
        >
          <AiOutlineHome className="text-3xl text-gray-800 dark:text-gray-200"/>
        </button>  
      </div> 

      {/* Multi-Step Component */}
      <div className="max-w-3xl w-full">
        <MultiStepComponent sessionId={sessionId} />
      </div>
    </main>
  );
};

export default Onboarding;
