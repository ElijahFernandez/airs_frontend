import React from "react";

interface QuestionAnswerBoxProps {
  theme: string; 
  question: string;
  answer: string;
  index: number;
  totalQuestions: number;
}

const QuestionAnswerBox: React.FC<QuestionAnswerBoxProps> = ({
  theme,
  question,
  answer,
  index,
  totalQuestions,
}) => {

  return (
    <div className="flex flex-col gap-0">
      {/* Question Box */}
      <div className="p-9 border border-black/[0.2] dark:border-white/[0.2] rounded-t-md bg-midlighter shadow-sm">
        <div className="pb-2 top-1 left-2 text-gray-500 text-xs flex gap-3">
          <p className="text-xs pb-2" style={{ color: "#FFFFFF" }}>
            {theme} 
          </p>
          <p>
            |&nbsp;&nbsp;&nbsp;{index + 1} / {totalQuestions}  
          </p>
          
        </div>
        <p className="font-medium pb-5 italic">&quot;{question}&quot;</p>
      </div>

      {/* Answer Box (Larger) */}
      <div className="p-9 border border-black/[0.2] dark:border-white/[0.2] rounded-b-md bg-midlight text-white shadow-md">
        <div className="pb-2 top-1 left-2 text-gray-500 text-xs">
          <p>Answer:</p>
        </div>
        <p className="pb-5">{answer || "No answer provided"}</p>
        <div className="flex justify-start gap-2 mt-4">
          <button className="px-4 py-2 border border-relevance text-relevance rounded-md
           hover:bg-relevance/10 transition duration-300 ease-in-out transform hover:scale-105">
            Relevance
          </button>
          <button className="px-4 py-2 border border-clarity text-clarity rounded-md
           hover:bg-clarity/10 transition duration-300 ease-in-out transform hover:scale-105">
            Clarity
          </button>
          <button className="px-4 py-2 border border-depth text-depth rounded-md
           hover:bg-depth/10 transition duration-300 ease-in-out transform hover:scale-105">
            Depth
          </button>
          <button className="px-4 py-2 border border-professionalism text-professionalism rounded-md
           hover:bg-professionalism/10 transition duration-300 ease-in-out transform hover:scale-105">
            Professionalism
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswerBox;
