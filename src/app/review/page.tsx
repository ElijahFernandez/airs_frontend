'use client';
import React, { useState, useEffect, useRef } from "react";
import Congrats from "./components/Congrats";
import ProgressCircle from "./components/ProgressCircle";
import QuestionAnswerBox from "./components/QuestionAnswerBox"; // Import QuestionAnswerBox

interface RatedDataEntry {
  question: string;
  answer: string;
  score: { predicted_scores: number[][] }; // Array of arrays
}

const Review = () => {
  const [ratedData, setRatedData] = useState<RatedDataEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ratedDataString = sessionStorage.getItem("rated_data");

    if (ratedDataString) {
      try {
        const ratedDataParsed = JSON.parse(ratedDataString);
        console.log("Parsed rated data:", ratedDataParsed);

        if (ratedDataParsed.processed_data && Array.isArray(ratedDataParsed.processed_data)) {
          setRatedData(ratedDataParsed.processed_data);
        } else {
          setError("Rated data does not contain 'processed_data' or it's not an array.");
        }
      } catch (err) {
        setError("Error parsing rated data.");
      }
    } else {
      setError("No rated data found.");
    }
  }, []);

  // Function to compute average scores in percentage
const computeAverageScores = () => {
  if (!ratedData || ratedData.length === 0) return [0, 0, 0, 0];

  const scoreSums = [0, 0, 0, 0]; // Sum of scores for each category
  const count = ratedData.length; // Number of entries

  ratedData.forEach((entry) => {
    entry.score.predicted_scores[0].forEach((score, idx) => {
      scoreSums[idx] += score;
    });
  });

  // Compute the averages and scale to percentage (assuming max score is 1.0)
  return scoreSums.map((sum) => Math.round((sum / count) * 10)); // Convert to percentage
};

const [avgRelevance, avgClarity, avgDepth, avgProfessionalism] = computeAverageScores();


  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <Congrats />
      <h1 className="text-2xl font-semibold mb-4 text-center pb-5">
        Overall Scores:
      </h1>

      <div className="flex gap-10 justify-center m-10">
        <ProgressCircle label="Relevance" value={avgRelevance} color="#4CAF50" description="Measures how well the answer addresses the question." />
        <ProgressCircle label="Clarity" value={avgClarity} color="#2196F3" description="Measures how well the answer is articulated." />
        <ProgressCircle label="Depth" value={avgDepth} color="#9C27B0" description="Measures the level of detail in the answer." />
        <ProgressCircle label="Professionalism" value={avgProfessionalism} color="#FF9800" description="Measures overall demeanor and communication style." />
      </div>


      {/* Save and Restart Buttons */}
      <div className="flex gap-4 mt-3 mx-auto mb-10">
        <button className="px-4 py-2 border border-relevance text-relevance rounded-lg hover:bg-relevance hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
          Save
        </button>
        <button className="px-4 py-2 border border-clarity text-clarity rounded-lg hover:bg-clarity hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
          Restart
        </button>
      </div>

      {/* Display Rated Data Using QuestionAnswerBox */}
      {error && <p className="text-red-500">{error}</p>}

      {ratedData ? (
        <div className="flex flex-col items-center space-y-10 w-full">
          {ratedData.map((entry, index) => (
            <QuestionAnswerBox
              key={index}
              question={entry.question}
              answer={entry.answer}
              index={index}
              totalQuestions={ratedData.length}
              // scores={[
              //   { label: "Relevance", value: entry.score.predicted_scores[0][0]?.toFixed(2) ?? "N/A" },
              //   { label: "Clarity", value: entry.score.predicted_scores[0][1]?.toFixed(2) ?? "N/A" },
              //   { label: "Depth", value: entry.score.predicted_scores[0][2]?.toFixed(2) ?? "N/A" },
              //   { label: "Professionalism", value: entry.score.predicted_scores[0][3]?.toFixed(2) ?? "N/A" },
              // ]}
            />
          ))}
        </div>
      ) : (
        <p>Loading responses...</p>
      )}
    </div>
  );
};

export default Review;
