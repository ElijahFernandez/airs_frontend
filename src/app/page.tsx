import React from "react";
import Hero from "@/components/hero";
import Approach from "@/components/Approach";
// import GradientOverlay from "@/components/ui/GradientOverlay";
const Home = () => {
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
