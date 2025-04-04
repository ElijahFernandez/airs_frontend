"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Approach = () => {
  return (
    <section id="approach" className="w-full py-20">
      <h1 className="font-bold text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl"> 
        How the <span className="text-textpurple">system  </span> works
      </h1>
      <div className="my-10 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="Discover your path"
          icon={<AceternityIcon order="Phase 1" />}
          des="Begin by selecting a job role that matches your interests or career goals. This choice will tailor the interview questions and feedback to the specific skills and qualifications required for the role."
        >
        </Card>
        <Card
          title="Showcase your skills"
          icon={<AceternityIcon order="Phase 2" />}
          des="Engage in a simulated interview with the chatbot. Answer a series of thoughtfully designed questions that assess your expertise, problem-solving skills, and communication abilities."
        >
        </Card>
        <Card
          title="Learn and improve"
          icon={<AceternityIcon order="Phase 3" />}
          des="Review your performance with a detailed score breakdown and personalized feedback. Gain actionable insights to help you refine your skills and increase your chances of success in real-world interviews."
        >
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  // add this one for the desc
  des,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // change h-[30rem] to h-[35rem], add rounded-3xl
      className="bg-backgroundgray border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl "
      // style={{
      //   //   add these two
      //   //   you can generate the color from here https://cssgradient.io/
      //   background: "rgb(4,7,29)",
      //   backgroundColor:
      //     "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      // }}
    >
      
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 px-10">
        <div
          // add this for making it center
          // absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          className="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
        group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
        >
          {icon}
        </div>
        <h2
          // change text-3xl, add text-center
          className="dark:text-foreground text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-foreground
         group-hover/canvas-card:-translate-y-2 transition duration-200"
        >
          {title}
        </h2>
        {/* add this one for the description */}
        <p
          className="text-mm opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 group-hover/canvas-card:text-foreground text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200 text-foreground"
        >
          {des}
        </p>
      </div>
    </div>
  );
};
// add order prop for the Phase number change
const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      {/* remove text-sm font-medium h-12 , add font-bold text-2xl */}
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px] ">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
        <span
          className="bg-inline-flex h-full w-full cursor-pointer items-center 
        justify-center rounded-full bg-background px-5 py-2 text-textpurple backdrop-blur-3xl font-bold text-2xl"
        >
          {order}
        </span>
      </button>
    </div>
  );
};

