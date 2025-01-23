import { Dispatch, SetStateAction } from "react";

interface JobCardProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  currentItem: string;
  imageUrl: string;
  sessionId: string | null; // Accept sessionId as a prop
}

const JobCard = ({
  showModal,
  setShowModal,
  currentItem,
  imageUrl,
  sessionId,
}: JobCardProps) => {
  if (!showModal) return null; // Don't render anything if modal is not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gradient-to-br from-blue-950 from-10% via-indigo-950 via-30% to-blue-950 to-90% p-6 rounded-md shadow-lg w-80 h-[25rem] flex flex-col justify-between"
      >
        {/* Image and Title Section */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <img
            src={imageUrl}
            alt={currentItem}
            className="w-24 h-24"
          />
          <h2 className="text-white text-lg text-center font-bold">
            You have chosen: "{currentItem}"
          </h2>
          <h4 className="text-white text-sm text-center">
            Is this the job you want to go with?
          </h4>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-2">
          <a
            href={`/interview/chat?job=${encodeURIComponent(currentItem)}&session=${encodeURIComponent(sessionId || '')}`} // Redirect with both currentItem and sessionId as query parameters
            onClick={() => setShowModal(false)} // Close modal on navigation
            className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-md text-center"
          >
            Confirm
          </a>
          <button
            onClick={() => setShowModal(false)} // Close modal on Cancel button click
            className="border border-gray-500 text-gray-500 bg-transparent px-8 py-3 rounded-full shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
