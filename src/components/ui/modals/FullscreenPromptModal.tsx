import React, { useState } from "react";

interface FullscreenPromptModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleConfirm: () => void;
}

const FullscreenPromptModal: React.FC<FullscreenPromptModalProps> = ({
  showModal,
  handleConfirm,
}) => {
  if (!showModal) return null; // Prevent rendering when not needed

  const [currentPage, setCurrentPage] = useState(0);

  // Content for each page
  const pages = [
    {
      title: "Navigation",
      content:
        "You can always exit through the Home button located at the top left of the screen. However, if you leave this way, the interview will not be saved for rating.",
    },
    {
      title: "Timer",
      content: "There is a timer of 15 minutes, which you can toggle to show or hide at the top of the screen.",
    },
    {
      title: "Early Termination",
      content: "You can press 'Alt+E' at any time to prematurely end the interview. The content so far will then be rated.",
    },
    {
      title: "Fullscreen Requirement",
      content: "Fullscreen mode is a must for the best experience during the interview.",
    },
  ];

  // Handle page navigation
  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-[400px]">
        <h2 className="text-xl font-semibold mb-4">{pages[currentPage].title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {pages[currentPage].content}
        </p>

        {/* Pagination Controls */}
        <div className="flex justify-center mb-4">
          {pages.map((_, index) => (
            <span
              key={index}
              onClick={() => goToPage(index)}
              className={`cursor-pointer mx-1 rounded-full w-3 h-3 ${
                currentPage === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousPage}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={currentPage === pages.length - 1}
          >
            Next
          </button>
        </div>

        {/* Confirm Button */}
        {currentPage === pages.length - 1 && (
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Enter Fullscreen
          </button>
        )}
      </div>
    </div>
  );
};

export default FullscreenPromptModal;
