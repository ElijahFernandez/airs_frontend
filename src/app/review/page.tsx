'use client';
import React, { useState, useEffect, useRef } from "react";
import Congrats from "./components/Congrats";
import ProgressCircle from "./components/ProgressCircle";
import QuestionAnswerBox from "./components/QuestionAnswerBox";
import SaveConfirmationModal from "./../../components/ui/modals/SaveConfirmationModal";
import LoadingModal from "./../../components/ui/modals/LoadingModal";
import ExitConfirmationModal from "./../../components/ui/modals/ExitConfirmationModal"; // Import Exit Modal
import { useSearchParams, useRouter } from "next/navigation";

interface RatedDataEntry {
  question: string;
  answer: string;
  score: { predicted_scores: number[][] };
}

const Review = () => {
  const [ratedData, setRatedData] = useState<RatedDataEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePayload, setSavePayload] = useState<any>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // State for Exit Modal

  const router = useRouter(); // Next.js router

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ratedDataString = sessionStorage.getItem("rated_data");

    if (ratedDataString) {
      try {
        const ratedDataParsed = JSON.parse(ratedDataString);
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

  const computeAverageScores = () => {
    if (!ratedData || ratedData.length === 0) return [0, 0, 0, 0];

    const scoreSums = [0, 0, 0, 0];
    const count = ratedData.length;

    ratedData.forEach((entry) => {
      entry.score.predicted_scores[0]?.forEach((score, idx) => {
        scoreSums[idx] += score;
      });
    });

    return scoreSums.map((sum) => Math.round((sum / count) * 20));
  };

  const [avgRelevance, avgClarity, avgDepth, avgProfessionalism] = computeAverageScores();

  const handleSave = () => {
    if (!sessionId || !ratedData) {
      setError("Missing session ID or rated data.");
      return;
    }

    const computedScores = computeAverageScores();
    const payload = {
      sessionId,
      ratedData,
      averageScores: {
        relevance: computedScores[0],
        clarity: computedScores[1],
        depth: computedScores[2],
        professionalism: computedScores[3],
      },
    };

    setSavePayload(payload);
    setShowSaveModal(true);
  };

  const handleConfirmSave = async (email: string) => {
    setShowSaveModal(false);
    setIsSendingEmail(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...savePayload, email }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      setIsSendingEmail(false);
      setIsEmailSent(true);
    } catch (error) {
      setIsSendingEmail(false);
      setError("Error sending report.");
    }
  };

  const handleExit = () => {
    if (isEmailSent) {  
      router.push("/"); // Redirect immediately if email is sent
    } else {
      setShowExitModal(true); // Show confirmation modal if email is NOT sent
    }
  };
  

  const handleConfirmExit = () => {
    sessionStorage.removeItem("rated_data"); // Clear session storage
    router.push("/"); // Redirect to home or another page
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <Congrats />
      <h1 className="text-2xl font-semibold mb-4 text-center pb-5">Overall Scores:</h1>

      <div className="flex gap-10 justify-center m-10">
        <ProgressCircle label="Relevance" value={avgRelevance} color="#4CAF50" description="Measures how well the answer addresses the question." />
        <ProgressCircle label="Clarity" value={avgClarity} color="#2196F3" description="Measures how well the answer is articulated." />
        <ProgressCircle label="Depth" value={avgDepth} color="#9C27B0" description="Measures the level of detail in the answer." />
        <ProgressCircle label="Professionalism" value={avgProfessionalism} color="#FF9800" description="Measures overall demeanor and communication style." />
      </div>

      {/* Save and Exit Buttons */}
      <div className="flex gap-4 mt-3 mx-auto mb-10 mt-7">
        <button onClick={handleSave} disabled={isEmailSent} className="px-4 py-2 border border-relevance text-relevance rounded-lg hover:bg-relevance hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
          Save
        </button>
        <button onClick={handleExit} className="px-4 py-2 border border-clarity text-clarity rounded-lg hover:bg-clarity hover:text-white transition duration-300 ease-in-out transform hover:scale-105">
          Exit
        </button>
      </div>

      {/* Modals */}
      <SaveConfirmationModal showModal={showSaveModal} setShowModal={setShowSaveModal} payload={savePayload} handleConfirmSave={handleConfirmSave} />
      <ExitConfirmationModal showModal={showExitModal} setShowModal={setShowExitModal} handleConfirmExit={handleConfirmExit} />

      {error && <p className="text-red-500">{error}</p>}

      {ratedData ? (
        <div className="flex flex-col items-center space-y-10 w-full">
          {ratedData.map((entry, index) => (
            <QuestionAnswerBox key={index} question={entry.question} answer={entry.answer} index={index} totalQuestions={ratedData.length} />
          ))}
        </div>
      ) : (
        <p>Loading responses...</p>
      )}

      <LoadingModal show={isSendingEmail} />
    </div>
  );
};

export default Review;
