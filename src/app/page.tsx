"use client";

import React, { useEffect } from "react";
// import Hero from "@/components/hero";
// import Approach from "@/components/Approach";
// import GradientOverlay from "@/components/ui/GradientOverlay";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/hero"), { ssr: false });
const Approach = dynamic(() => import("@/components/Approach"), { ssr: true });

const Home = () => {
  useEffect(() => {
    // Prevent the user from going back to the previous page
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  return (
    <main className="flex justify-center items-center flex-col overflow-hidden mx-auto">
      <div className="max-w-7xl w-full">
        {/* <GradientOverlay/> */}
        <Hero />
        <Approach />
      </div>
    </main>
  );
};

export default Home;
