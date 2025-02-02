"use client";

import React, { useState, useEffect } from "react";

interface InterviewEntry {
  question: string;
  answer: string;
}

const Review = () => {
  const [interviewData, setInterviewData] = useState<InterviewEntry[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await fetch("http://localhost:5000/export-data", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interview data");
        }

        const data = await response.json();
        setInterviewData(data.interview_data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchInterviewData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Interview Review</h1>
      {interviewData ? (
        <div className="space-y-4">
          {interviewData.map((item, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-100">
              <p className="font-medium">Q: {item.question}</p>
              <p className="text-gray-700 mt-1">
                A: {item.answer || "No answer provided"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading interview data...</p>
      )}
    </div>
  );
};

export default Review;
