"use client";

import React, { useEffect, useState } from "react";
import MultiStepComponent from "./components/multistepcomponent";
import { API_BASE_URL } from "@/utils/config";

const Onboarding = () => {
  const [sessionId, setSessionId] = useState<string | null>(null); // Explicitly type the state
  const [serverStatus, setServerStatus] = useState<string | null>(null); // State to store backend status

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    setSessionId(session); // session can be a string or null

    // Check if AIRS Backend is running
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`);
        const data = await response.json();
        setServerStatus(data.message);
        console.log("Server status: " + serverStatus)
      } catch (error) {
        setServerStatus("Failed to connect to backend, " + error);
      }
    };

    checkServerStatus();
  }, [serverStatus]);

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Multi-Step Component */}
      <div className="max-w-3xl w-full">
        <MultiStepComponent sessionId={sessionId} />
      </div>
    </main>
  );
};

export default Onboarding;
