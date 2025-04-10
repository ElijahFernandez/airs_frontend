import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use Next.js navigation
import Job from "../../../../public/job-done.jpg";

interface InterviewOverModalProps {
  sessionId: string | null;
}

const InterviewOverModal: React.FC<InterviewOverModalProps> = ({ sessionId }) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (sessionId ) {
      sessionStorage.setItem("manual_exit", "true");
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          router.push(`/review?sessionId=${sessionId}`);
        });
      } else {
        router.push(`/review?sessionId=${sessionId}`);
      }
    } else {
      router.push("/review");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-blue-950 from-10% via-indigo-950 via-30% to-blue-950 to-90% p-8 rounded-2xl shadow-xl w-[30rem] h-[28rem] flex flex-col justify-between items-center">
        
        {/* Larger Image with Spacing */}
        <div className="w-50 h-42 rounded-lg overflow-hidden mb-5">
          <Image
            src={Job} 
            alt="Time's Up"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Message Section */}
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 px-6">
          <h2 className="text-white text-2xl font-bold">Time&apos;s Up!</h2>
          <p className="text-white text-sm leading-relaxed">
          Thank you for your time today! We will review your performance and get back to you with the results soon. Have a great day!
          </p>
        </div>

        {/* Button with Proper Margin */}
        <button
          onClick={handleRedirect}
          className="bg-blue-500 text-white px-10 py-3 rounded-lg shadow-md text-lg mt-4"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default InterviewOverModal;
