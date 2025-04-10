import React from "react";

interface ExitConfirmationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleConfirmExit: () => void;
  handleCancel?: () => void; // Optional cancel handler
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({ 
  showModal, 
  setShowModal, 
  handleConfirmExit, 
  handleCancel 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-backgroundgray p-6 rounded-md shadow-lg w-96 h-auto flex flex-col items-center z-[1001] relative">
        <h2 className="text-lg font-semibold mb-4">Confirm Exit</h2>
        <p className="text-foreground mb-6 text-center">
          Are you sure you want to exit? Any unsaved progress will be lost.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel ? handleCancel : () => setShowModal(false)}
            className="px-4 py-2 border border-gray-400 text-foreground rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmExit}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
