import { Dispatch, SetStateAction, useState } from "react";
import Celebrate from "../../../../public/celebrate.png";
import Image from "next/image";

interface SaveConfirmationModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  payload: unknown;
  handleConfirmSave: (email: string) => void;
}

const SaveConfirmationModal = ({
  showModal,
  setShowModal,
  payload,
  handleConfirmSave,
}: SaveConfirmationModalProps) => {
  const [email, setEmail] = useState("");

  if (!showModal) return null;

  console.log(payload);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-blue-950 from-10% via-indigo-950 via-30% to-blue-950 to-90% p-6 rounded-md shadow-lg w-96 h-auto flex flex-col">
        {/* Image and Title Section */}
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={Celebrate}
            alt="Congratulations"
            width={100}
            height={100}
            className="object-contain"
          />
          <h2 className="text-white text-lg text-center font-bold">
            Congratulations for completing the interview!
          </h2>
          <h4 className="text-white text-sm text-center">
            Your interview report will be sent to the email you provide below.
          </h4>
        </div>

        {/* Email Input and Buttons */}
        <div className="mt-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
            placeholder="Enter your email..."
          />
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => handleConfirmSave(email)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md text-center text-sm"
            >
              Send Report
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="border border-gray-500 text-gray-500 bg-transparent px-6 py-2 rounded-full shadow-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;
