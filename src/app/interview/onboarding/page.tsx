"use client";

import React, { useEffect, useState } from "react";
import MultiStepComponent from "./components/multistepcomponent";

const Onboarding = () => {
  const [sessionId, setSessionId] = useState<string | null>(null); // Explicitly type the state

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    setSessionId(session); // session can be a string or null
  }, []);

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
