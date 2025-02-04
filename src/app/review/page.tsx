"use client";

import React, { useState, useEffect } from "react";
import Congrats from "./components/Congrats";
import ProgressCircle from "./components/ProgressCircle";
import QuestionAnswerBox from "./components/QuestionAnswerBox";

// placeholders for scores
const scores = {
  Relevance: 85,
  Clarity: 90,
  Depth: 75,
  Professionalism: 80,
};

interface InterviewEntry {
  theme: string;
  question: string;
  answer: string;
}

const mockInterviewData: InterviewEntry[] = [
  {
    theme: "Self-Introduction",
    question: "Tell me about yourself.",
    answer:
      "I am a computer science student passionate about AI and system administration.",
  },
  {
    theme: "Learning and Adaptability",
    question: "What are your strengths?",
    answer: "I am highly adaptable and have strong problem-solving skills.",
  },
  {
    theme: "Motivation and Goals",
    question: "Where do you see yourself in 5 years?",
    answer:
      "I see myself as a system administrator, leading infrastructure projects.",
  },
  {
    theme: "Motivation and Goals",
    question: "Why do you want to work here?",
    answer:
      "I am impressed by your company's commitment to innovation and excellence.",
  },
  {
    theme: "Teamwork and Collaboration",
    question: "How do you handle stress and pressure?",
    answer:
      "I prioritize tasks, stay organized, and take breaks to maintain productivity.",
  },
];

const Review = () => {
  const [interviewData, setInterviewData] = useState<InterviewEntry[] | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //   const fetchInterviewData = async () => {
    //     try {
    //       const response = await fetch("http://localhost:5000/export-data", {
    //         method: "POST",
    //       });

    //       if (!response.ok) {
    //         throw new Error("Failed to fetch interview data");
    //       }

    //       const data = await response.json();
    //       setInterviewData(data.interview_data);
    //     } catch (err) {
    //       setError("Failed to fetch data. Please try again. (" + err + ")");
    //     }
    //   };

    //   fetchInterviewData();
    // }, []);

    // Simulate fetching data
    const fetchInterviewData = async () => {
      try {
        // Simulating a delay to mimic fetching from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Using mock data instead of actual API call
        setInterviewData(mockInterviewData);
      } catch (err) {
        setError("Failed to fetch data. Please try again. (" + err + ")");
      }
    };

    fetchInterviewData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex-col items-center">
      <Congrats />
      <h1 className="text-2xl font-semibold mb-4 text-center pb-5">
        Overall Scores:
      </h1>
      <div className="flex flex-col items-center border-">
        {/* Overall Scores in Progress Bar */}
        <div className="flex gap-10 justify-center m-10">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} className="relative flex flex-col items-center">
              <ProgressCircle
                label={key}
                value={value}
                color={
                  key === "Relevance"
                    ? "#4CAF50"
                    : key === "Clarity"
                    ? "#2196F3"
                    : key === "Depth"
                    ? "#9C27B0"
                    : key === "Professionalism"
                    ? "#FF9800"
                    : undefined
                }
                description={
                  key === "Relevance"
                    ? "Relevance measures how well the answer addresses the question."
                    : key === "Clarity"
                    ? "Clarity measures how well the answer is articulated and structured."
                    : key === "Depth"
                    ? "Depth measures the level of detail and insight in the answer."
                    : key === "Professionalism"
                    ? "Professionalism measures the overall demeanor and communication style."
                    : undefined
                }
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 mx-auto mb-20">
            <button className="px-4 py-2 border border-relevance text-relevance rounded-lg hover:bg-relevance hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
            Save
            </button>
          <button className="px-4 py-2 border border-clarity  text-clarity rounded-lg hover:bg-clarity hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
            Restart
          </button>
        </div>
      </div>

      {interviewData ? (
        <div className="space-y-10">
          {interviewData.map(
            (
              item,
              index // Modularized QuestionAnswerBox component
            ) => (
              <QuestionAnswerBox
                theme={item.theme}
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
                totalQuestions={interviewData.length}
              />
            )
          )}
        </div>
      ) : (
        <p>Loading interview data...</p>
      )}
      {/* <Congrats /> */}
    </div>
  );
};

export default Review;
