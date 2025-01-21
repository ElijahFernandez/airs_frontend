import Navbar from "@/components/navbar";
import React from "react";
import Hero from "@/components/hero";
import Approach from "@/components/Approach";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Navbar />
        <Hero />
        <Approach />
      </div>
      
      {/* Footer outside the container */}
      <Footer />
    </main>
  );
};

export default Home;
