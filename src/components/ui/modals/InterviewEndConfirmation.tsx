import React from "react";

interface InterviewEndConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
}

const InterviewEndConfirmation: React.FC<InterviewEndConfirmationProps> = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-2xl h-[16rem] flex flex-col justify-between items-center">
        
        {/* Title & Message Section */}
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 px-6">
          <h2 className="text-foreground text-2xl font-bold">End Interview?</h2>
          <p className="text-foreground text-sm leading-relaxed">
            Are you sure you want to end the interview? This action cannot be undone.
          </p>
        </div>

        {/* Button Section */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className="px-6 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-all"
            onClick={onClose}
          >
            Return
          </button>
          <button
            className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-all"
            onClick={() => { 
              onConfirm(); // Trigger the terminateInterview state change
              onClose(); // Close the modal after confirmation
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewEndConfirmation;
