// components/ChangeCustomJob.tsx
import { Dispatch, SetStateAction } from "react";

interface ChangeCustomJobProps {
  showModal: boolean;
  newTitle: string;
  setNewTitle: Dispatch<SetStateAction<string>>;
  handleSubmit: () => void;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ChangeCustomJob = ({
  showModal,
  newTitle,
  setNewTitle,
  handleSubmit,
  setShowModal,
}: ChangeCustomJobProps) => {
  if (!showModal) return null; // Don't render anything if modal is not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-80">
        <h2 className="text-lg mb-4">Edit Job Title</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeCustomJob;
