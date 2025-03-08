import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface QuestionAnswerBoxProps {
  question: string;
  answer: string;
  scores: number[];
  index: number;
  totalQuestions: number;
}

interface HighlightResponse {
  highlights: string[];
}

const QuestionAnswerBox: React.FC<QuestionAnswerBoxProps> = ({
  question,
  answer,
  index,
  totalQuestions,
  scores,
}) => {
  const [showScores, setShowScores] = useState(false);
  const [loading, setLoading] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [showExtra, setShowExtra] = useState(false);
  const [sparklesLoading, setSparklesLoading] = useState(false);
  const [refinedFeedback, setRefinedFeedback] = useState("");
  const [sparklesDisabled, setSparklesDisabled] = useState(false);
  const [currentRubric, setCurrentRubric] = useState("");

  const highlightText = (text: string, highlightPhrases: string[]) => {
    if (!highlightPhrases.length) return text;

    let result = text;
    let highlightClass = "";
    
    // Set highlight color based on current rubric
    switch (currentRubric) {
      case "analyze_relevance":
        highlightClass = "bg-relevance";
        break;
      case "analyze_clarity":
        highlightClass = "bg-clarity";
        break;
      case "analyze_depth":
        highlightClass = "bg-depth";
        break;
      case "analyze_professionalism":
        highlightClass = "bg-professionalism";
        break;
      default:
        highlightClass = "bg-yellow-200 dark:bg-yellow-800";
    }
    
    highlightPhrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, "gi");
      result = result.replace(
        regex,
        `<span class="${highlightClass}">$1</span>`
      );
    });
    return result;
  };

  const analyzeResponse = async (rubric: string) => {
    setLoading(rubric);
    setHighlights([]);
    setCurrentRubric(rubric);

    try {
      const endpoint = `http://127.0.0.1:5000/highlight/${rubric}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, response: answer }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: HighlightResponse = await response.json();
      setHighlights(data.highlights);
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading("");
    }
  };

  const handleSparklesClick = async () => {
    // Show the extra content area
    setShowExtra(true);
    // Begin loading for sparkles button
    setSparklesLoading(true);
    // Clear previous feedback if any
    setRefinedFeedback("");
    // Disable the sparkles button after it's pressed
    setSparklesDisabled(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/highlight/refine_response",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, response: answer, scores }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setRefinedFeedback(data.refined_feedback);
    } catch (error) {
      console.error("Error fetching refined feedback:", error);
      setRefinedFeedback("Error fetching refined feedback.");
    } finally {
      setSparklesLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-0 w-[800px]">
      <div className="p-9 border border-black/[0.2] dark:border-white/[0.2] rounded-t-md bg-midlighter shadow-sm">
        <div className="pb-2 top-1 left-2 text-gray-500 text-xs flex gap-3">
          <p>
            |&nbsp;&nbsp;&nbsp;{index + 1} / {totalQuestions}
          </p>
        </div>
        <p className="font-medium pb-5 italic">&quot;{question}&quot;</p>
      </div>

      <div className="p-9 border border-black/[0.2] dark:border-white/[0.2] rounded-b-md bg-midlight text-white shadow-md">
        <div className="pb-2 top-1 left-2 text-gray-500 text-xs">
          <p>Answer:</p>
        </div>
        <p
          className="pb-5"
          dangerouslySetInnerHTML={{
            __html: highlights.length
              ? `<i>"${highlightText(answer, highlights)}"</i>`
              : `<i>"${answer || "No answer provided"}"</i>`,
          }}
        />
        {/* Extra content that starts hidden */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showExtra
              ? "translate-y-0 opacity-100 max-h-screen"
              : "translate-y-4 opacity-0 max-h-0"
          }`}
        >
          <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />
          <div className="p-5 mt-4">
            <p className="text-gray-700 dark:text-white">
              {sparklesLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> Loading...
                </span>
              ) : refinedFeedback ? (
                refinedFeedback
              ) : (
                "when the sparkles button is pressed, smoothly transition this upwards. Hide this initially as well"
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-start gap-2 mt-4 transition-all duration-300">
          <button
            onClick={() => analyzeResponse("analyze_relevance")}
            disabled={!!loading}
            className="px-4 py-2 border border-relevance text-relevance rounded-md hover:bg-relevance hover:text-white transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === "analyze_relevance" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Analyzing...
              </>
            ) : showScores ? (
              `Relevance | ${scores[0].toFixed(2)}`
            ) : (
              "Relevance"
            )}
          </button>

          <button
            onClick={() => analyzeResponse("analyze_clarity")}
            disabled={!!loading}
            className="px-4 py-2 border border-clarity text-clarity rounded-md hover:bg-clarity hover:text-white transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === "analyze_clarity" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Analyzing...
              </>
            ) : showScores ? (
              `Clarity | ${scores[1].toFixed(2)}`
            ) : (
              "Clarity"
            )}
          </button>

          <button
            onClick={() => analyzeResponse("analyze_depth")}
            disabled={!!loading}
            className="px-4 py-2 border border-depth text-depth rounded-md hover:bg-depth hover:text-white transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === "analyze_depth" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Analyzing...
              </>
            ) : showScores ? (
              `Depth | ${scores[2].toFixed(2)}`
            ) : (
              "Depth"
            )}
          </button>

          <button
            onClick={() => analyzeResponse("analyze_professionalism")}
            disabled={!!loading}
            className="px-4 py-2 border border-professionalism text-professionalism rounded-md hover:bg-professionalism hover:text-white transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading === "analyze_professionalism" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Analyzing...
              </>
            ) : showScores ? (
              `Professionalism | ${scores[3].toFixed(2)}`
            ) : (
              "Professionalism"
            )}
          </button>
          <div className="flex justify-start gap-2">
            <button
              onClick={handleSparklesClick}
              disabled={sparklesDisabled || sparklesLoading}
              className={`group px-4 py-2 border rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center ${
                sparklesDisabled
                  ? "border-gray-400 bg-gray-200 cursor-not-allowed"
                  : "border-sparkles text-sparkles hover:bg-white"
              }`}
            >
              <Sparkles
                className={`h-4 w-4 ${
                  sparklesDisabled
                    ? "text-gray-400"
                    : "text-white group-hover:text-midnight"
                }`}
              />
            </button>
          </div>
        </div>

        <p
          className="text-sm text-blue-400 underline mt-4 cursor-pointer transition-all duration-300"
          onClick={() => setShowScores(!showScores)}
        >
          {showScores ? "Hide scores" : "Show scores"}
        </p>
      </div>
    </div>
  );
};

export default QuestionAnswerBox;