import React from "react";

interface FullscreenPromptModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleConfirm: () => void;
}

const FullscreenPromptModal: React.FC<FullscreenPromptModalProps> = ({
  showModal,
  setShowModal,
  handleConfirm,
}) => {
  if (!showModal) return null; // Prevent rendering when not needed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Enter Fullscreen Mode</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          For the best experience, please switch to fullscreen mode.
        </p>
        <button
          onClick={handleConfirm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Enter Fullscreen
        </button>
      </div>
    </div>
  );
};

export default FullscreenPromptModal;
