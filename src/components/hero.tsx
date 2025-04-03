"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import Image from "next/image";
import MagicButton from "./ui/MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

const Hero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // Initialize router

  // Ensure theme is loaded to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents flickering on first render

  const handleGetStarted = () => {
    // Generate a new UUID
    sessionStorage.clear();
    localStorage.clear();
    const sessionId = uuidv4();
    // // Navigate to the onboarding page with the UUID in the query string
    // window.location.href = `/interview/onboarding?session=${sessionId}`;
    // Use Next.js router for client-side navigation
    router.push(`/interview/onboarding?session=${sessionId}`);
  };
  return (
    <div className="pb-36 pt-36">
      <div className="dark:bg-black-100 flex items-center justify-center"></div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <Image
            src={
              theme === "dark"
                ? "/logos/airs-w-bgr.png"
                : "/logos/airs-b-bgr.png"
            }
            alt="AIRS Logo"
            width={200}
            height={150}
            priority
            className="w-auto h-auto"
          />
          <TextGenerateEffect
            words="Guidance that transforms confidence into success"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Start today and take the first step toward interview success!
          </p>

          {/* Dynamically navigate to onboarding with the sessionId */}
          <MagicButton
            title="Get Started"
            icon={<FaLocationArrow />}
            position="right"
            handleClick={handleGetStarted}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
