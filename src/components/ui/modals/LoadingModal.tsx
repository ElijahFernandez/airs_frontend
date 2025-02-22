import React from "react";

interface LoadingModalProps {
  show: boolean;
}

const LoadingModal = ({ show }: LoadingModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-blue-950 from-10% via-indigo-950 via-30% to-blue-950 to-90% p-6 rounded-md shadow-lg w-96 h-auto flex flex-col items-center">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 border-solid rounded-full mb-3"></div>
        <h2 className="text-lg font-semibold">Sending email...</h2>
        <p className="text-gray-500 text-sm text-center">
          This might take a minute or two. Please wait.
        </p>
        <p className="text-gray-500 text-xs text-center">
          If a printer alert appears, don't cancel—it's just the PDF generating..
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
