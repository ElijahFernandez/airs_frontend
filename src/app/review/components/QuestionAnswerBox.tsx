import React, { useState } from "react";
import { Loader2 } from "lucide-react";

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

  const highlightText = (text: string, highlightPhrases: string[]) => {
    if (!highlightPhrases.length) return text;

    let result = text;
    highlightPhrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, "gi");
      result = result.replace(
        regex,
        '<span class="bg-yellow-200 dark:bg-yellow-800">$1</span>'
      );
    });
    return result;
  };

  const analyzeResponse = async (rubric: string) => {
    setLoading(rubric);
    setHighlights([]);

    try {
      const endpoint = `http://127.0.0.1:5000/api/${rubric}`;
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

        <div className="flex justify-start gap-2 mt-4 transition-all duration-300">
          <button
            onClick={() => analyzeResponse("analyze_relevance")}
            disabled={!!loading}
            className="px-4 py-2 border border-relevance text-relevance rounded-md hover:bg-relevance/10 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="px-4 py-2 border border-clarity text-clarity rounded-md hover:bg-clarity/10 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="px-4 py-2 border border-depth text-depth rounded-md hover:bg-depth/10 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="px-4 py-2 border border-professionalism text-professionalism rounded-md hover:bg-professionalism/10 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
