'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobSlider from "@/app/interview/jobs/components/JobSlider";
import ExitConfirmationModal from "./../../../components/ui/modals/ExitConfirmationModal";

export default function Jobs() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [chosenJob] = useState<string>(""); // add setChosenJob if necessary ( find out if it is necessary )
  useEffect(() => {
    // Extract sessionId from the URL query parameters
    console.log()
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');
    setSessionId(session);
  }, []);

  useEffect(() => {
    const handleBackNavigation = (event: PopStateEvent) => {
      event.preventDefault(); // Prevent default back navigation
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.href); // Push the current state to prevent unintended navigation
    };

    window.history.pushState(null, "", window.location.href); // Ensure we start with a state
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, []);

  const handleExit = () => {
    
    router.push("/"); // Redirect to homepage on exit
  };

  // const handleStay = () => {
  //   setShowExitModal(false);
  // };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="text-center text-2xl md:text-3xl font-semibold mt-20 z-10 relative">
        Welcome to the Automated Interview Rating System!
      </div>
      <div className="text-center text-m md:text-l m-8">
        Before we begin, please choose a job position you&apos;re interested in from the list below. <br />
        If your desired job isn&apos;t listed, you can select the &apos;Custom Job&apos; option to enter it manually.
      </div>
      <div className="px-8 md:px-16 lg:px-32 flex-grow z-10 relative">
        <JobSlider sessionId={sessionId} chosenJob={chosenJob} />  {/* setChosenJob or chosenJob ??? */}
      </div>
      <p className="text-xs text-center text-gray-600 mx-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        For the &quot;Custom Job&quot;, make sure the job title you enter is properly formatted, including correct punctuation and capitalization. Double-check for any spelling errors to ensure it’s clear and professional.
      </p>

      {showExitModal && (
        <ExitConfirmationModal
          showModal={showExitModal}
          setShowModal={setShowExitModal}  // Correcting prop name
          handleConfirmExit={handleExit}
        />
      )}
    </div>
  );
}
