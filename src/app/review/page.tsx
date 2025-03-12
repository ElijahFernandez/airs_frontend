"use client";
import React, { useState, useEffect, useRef } from "react";
import Congrats from "./components/Congrats";
import ProgressCircle from "./components/ProgressCircle";
import QuestionAnswerBox from "./components/QuestionAnswerBox";
import SaveConfirmationModal from "./../../components/ui/modals/SaveConfirmationModal";
import LoadingModal from "./../../components/ui/modals/LoadingModal";
import ExitConfirmationModal from "./../../components/ui/modals/ExitConfirmationModal";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebaseConfig"; // Ensure correct Firestore setup
import { collection, addDoc } from "firebase/firestore";

interface RatedDataEntry {
  question: string;
  answer: string;
  score: { predicted_scores: number[][] };
}

const Review = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ratedData, setRatedData] = useState<RatedDataEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePayload, setSavePayload] = useState<unknown>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const router = useRouter();
  const [emailEntered, setEmailEntered] = useState(false); // Track if email is provided

  const helpfulLinks = {
    Relevance: [
      {
        title: "Writing Interview Questions",
        url: "https://www.indeed.com/career-advice/interviewing/writing-interview-questions",
      },
      {
        title: "The Art of Crafting Effective Interview Questions",
        url: "https://www.theopennotebook.com/2023/09/26/the-art-of-crafting-effective-interview-questions/",
      },
      {
        title: "How to Write Effective Qualitative Interview Questions",
        url: "https://uxmastery.com/how-to-write-effective-qualitative-interview-questions/",
      },
      {
        title: "Six Ways to Ask Better Questions in Interviews",
        url: "https://thewritepractice.com/six-ways-to-ask-better-questions-in-interviews/",
      },
      {
        title: "10 Tips for Effective Interview Questions",
        url: "https://voicedocs.com/en/blog/10-tips-for-effective-interview-questions",
      },
    ],
    Clarity: [
      {
        title: "How to Write Job Interview Questions",
        url: "https://www.evidenced.app/blog/how-to-write-job-interview-questions",
      },
      {
        title: "Writing Effective Interview Questions",
        url: "https://quillbot.com/courses/english-composition-ii-exposition-and-persuasion/chapter/writing-effective-interview-questions/",
      },
      {
        title: "Ask Smart Questions Like a Professional Interviewer",
        url: "https://www.investors.com/news/management/leaders-and-success/ask-smart-questions-like-a-professional-interviewer/",
      },
      {
        title: "Be Concise in an Interview",
        url: "https://jobsearchandinterviewcoach.com/how-to-be-concise-in-an-interview/",
      },
    ],
    Depth: [
      {
        title: "Developing Effective Research Questions",
        url: "https://www.restack.io/p/developing-effective-research-questions-answer-effective-open-ended-questioning-techniques",
      },
      {
        title: "Effective Feedback Strategies for Interviewees",
        url: "https://www.hrfraternity.com/hr-excellence/effective-feedback-strategies-for-interviewees-with-unclear-responses.html",
      },
      {
        title: "Guidelines for Structured Interview Training",
        url: "https://www.loc.gov/extranet/cld/structured-interview-training/guidelines.html",
      },
    ],
    Professionalism: [
      {
        title: "Situation, Task, Action, Result (STAR) Technique",
        url: "https://en.wikipedia.org/wiki/Situation%2C_task%2C_action%2C_result",
      },
      {
        title: "Know These Interview Questions and How to Answer Them",
        url: "https://money.usnews.com/money/careers/interviewing/articles/know-these-interview-questions-and-how-to-answer-them",
      },
      {
        title: "Interviewing Dos and Don’ts",
        url: "https://www.umf.maine.edu/careers/interviewing/interview-dos-and-donts/",
      },
      {
        title: "Guidelines for Structured Interview Training",
        url: "https://www.loc.gov/extranet/cld/structured-interview-training/guidelines.html",
      },
      {
        title: "Job Interview Tips: How to Make a Great Impression",
        url: "https://www.indeed.com/career-advice/interviewing/job-interview-tips-how-to-make-a-great-impression",
      },
    ],
  };

  useEffect(() => {
    // Retrieve sessionId from sessionStorage
    const storedSessionId = sessionStorage.getItem("session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      setError("Session ID is missing in sessionStorage.");
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ratedDataString = sessionStorage.getItem("rated_data");

    if (ratedDataString) {
      try {
        const ratedDataParsed = JSON.parse(ratedDataString);
        if (
          ratedDataParsed.processed_data &&
          Array.isArray(ratedDataParsed.processed_data)
        ) {
          setRatedData(ratedDataParsed.processed_data);
        } else {
          setError(
            "Rated data does not contain 'processed_data' or it's not an array."
          );
        }
      } catch (err) {
        setError("Error parsing rated data. (" + err + ")");
      }
    } else {
      setError("No rated data found.");
    }
  }, []);

  const computeAverageScores = () => {
    if (!ratedData || ratedData.length === 0) return [0, 0, 0, 0, 0];

    const scoreSums = [0, 0, 0, 0];
    const count = ratedData.length;

    ratedData.forEach((entry) => {
      entry.score.predicted_scores[0]?.forEach((score, idx) => {
        scoreSums[idx] += score;
      });
    });

    const averages = scoreSums.map((sum) => Math.round((sum / count) * 20));
    const overallAvg = Math.round(averages.reduce((a, b) => a + b, 0) / 4);

    return [...averages, overallAvg];
  };

  const [avgRelevance, avgClarity, avgDepth, avgProfessionalism, overallAvg] =
    computeAverageScores();

  const lowScoreCriteria = [
    { name: "Relevance" as const, score: avgRelevance },
    { name: "Clarity" as const, score: avgClarity },
    { name: "Depth" as const, score: avgDepth },
    { name: "Professionalism" as const, score: avgProfessionalism },
  ].filter((criterion) => criterion.score < 50);

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
      links: {} as Record<string, { title: string; url: string }[]>,
      timestamp: new Date().toISOString(),
    };

    const lowScoreCriteria = [
      { name: "Relevance" as const, score: computedScores[0] },
      { name: "Clarity" as const, score: computedScores[1] },
      { name: "Depth" as const, score: computedScores[2] },
      { name: "Professionalism" as const, score: computedScores[3] },
    ].filter((criterion) => criterion.score < 50);

    // Add the links to the payload for criteria with scores below 50
    lowScoreCriteria.forEach(({ name }) => {
      const storedLinks = sessionStorage.getItem(name);
      const links = storedLinks ? JSON.parse(storedLinks) : [];
      payload.links[name] = links; // Store the relevant links for each criterion
    });

    // Show the modal to confirm save action
    setSavePayload(payload);
    setShowSaveModal(true);

    const formattedRatedData = ratedData.map((entry) => ({
      ...entry,
      score: { predicted_scores: entry.score.predicted_scores[0] }, // Flattening the nested array
    }));

    const flattenedPayload = {
      sessionId,
      ratedData: formattedRatedData,
      averageScores: {
        relevance: computedScores[0],
        clarity: computedScores[1],
        depth: computedScores[2],
        professionalism: computedScores[3],
      },
      links: payload.links,
      timestamp: new Date().toISOString(),
    };

    const saveToFirestore = async () => {
      try {
        await addDoc(collection(db, "savedReports"), flattenedPayload);
        console.log("Report successfully saved to Firestore!");
      } catch (error) {
        setError("Error saving report to Firestore. (" + error + ")");
      }
    };

    saveToFirestore();
  };

  const handleConfirmSave = async (email: string) => {
    setShowSaveModal(false);
    setIsSendingEmail(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/pdf/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(savePayload as Record<string, unknown>),
          email,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      setIsSendingEmail(false);
      setIsEmailSent(true);
      setEmailEntered(true);
    } catch (error) {
      setIsSendingEmail(false);
      setError("Error sending report. (" + error + ")");
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
    sessionStorage.clear(); // Clear session storage
    router.push("/"); // Redirect to home or another page
  };

  const selectRandomLinks = (
    links: { title: string; url: string }[],
    num: number
  ) => {
    const copiedLinks = [...links];
    const randomLinks = [];

    // Randomly select 'num' links from the available ones
    for (let i = 0; i < num; i++) {
      if (copiedLinks.length === 0) break; // Stop if no links are left
      const randomIndex = Math.floor(Math.random() * copiedLinks.length);
      randomLinks.push(copiedLinks.splice(randomIndex, 1)[0]);
    }

    return randomLinks;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <Congrats />
      <h1 className="text-2xl font-semibold mb-4 text-center pb-5">
        Overall Scores:
      </h1>

      <div className="flex justify-center m-5">
        <ProgressCircle
          label="Overall Score"
          value={overallAvg}
          color="#FF5722"
          description="Average of all scoring criteria."
          size={160} // Adjust size dynamically (optional)
        />
      </div>

      <div className="flex relative gap-10 justify-center m-10 pb-5">
        <ProgressCircle
          label="Relevance"
          value={avgRelevance}
          color="#4CAF50"
          description="Measures how well the answer addresses the question."
        />
        <ProgressCircle
          label="Clarity"
          value={avgClarity}
          color="#2196F3"
          description="Measures how well the answer is articulated."
        />
        <ProgressCircle
          label="Depth"
          value={avgDepth}
          color="#9C27B0"
          description="Measures the level of detail in the answer."
        />
        <ProgressCircle
          label="Professionalism"
          value={avgProfessionalism}
          color="#FF9800"
          description="Measures overall demeanor and communication style."
        />
      </div>

      {/* Save and Exit Buttons */}
      <div className="flex gap-4 mx-auto mb-10 mt-7">
        <button
          onClick={handleSave}
          disabled={isEmailSent}
          className="px-4 py-2 border border-relevance text-relevance rounded-lg hover:bg-relevance hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
        >
          Save
        </button>
        <button
          onClick={handleExit}
          disabled={!emailEntered}
          className={`px-4 py-2 border border-clarity text-clarity rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
            emailEntered
              ? "hover:bg-clarity hover:text-white"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          Exit
        </button>
      </div>

      {/* Modals */}
      <SaveConfirmationModal
        showModal={showSaveModal}
        setShowModal={setShowSaveModal}
        payload={savePayload}
        handleConfirmSave={handleConfirmSave}
      />
      <ExitConfirmationModal
        showModal={showExitModal}
        setShowModal={setShowExitModal}
        handleConfirmExit={handleConfirmExit}
      />

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
              scores={entry.score.predicted_scores[0]}
            />
          ))}
        </div>
      ) : (
        <p>Loading responses...</p>
      )}

      <LoadingModal show={isSendingEmail} />

      <div className="mt-4 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Helpful Links</h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          {lowScoreCriteria
            .filter(({ score }) => score < 50) // Only process criteria with scores below 50
            .map(({ name, score }) => {
              // Retrieve the randomized links for this criterion from sessionStorage
              let selectedLinks = [];
              console.log(score);
              // Retrieve the links stored for this criterion (individual arrays per criterion)
              const storedLinks = sessionStorage.getItem(name);
              const randomizedLinks = storedLinks
                ? JSON.parse(storedLinks)
                : [];

              if (randomizedLinks.length > 0) {
                // If links are already stored, use them
                selectedLinks = randomizedLinks;
              } else {
                // Otherwise, randomly select 2 links for this criterion
                const allLinks = helpfulLinks[name] || [];
                const randomLinks = selectRandomLinks(allLinks, 2);

                // Store the selected links in sessionStorage under the specific criterion
                sessionStorage.setItem(name, JSON.stringify(randomLinks));

                selectedLinks = randomLinks; // Use the newly selected links
              }

              return (
                <div key={name} className="mt-4">
                  <p className="text-white">
                    Your scores on <strong>{name}</strong> are below 50%. Here
                    are some relevant links that may help:
                  </p>
                  <ul className="list-disc list-inside mt-2">
                    {selectedLinks.map(
                      (link: { title: string; url: string }, index: number) => (
                        <li key={index}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {link.title}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Review;
