"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/app/interview/chat/components/ChatInterface";
import GradientOverlay from "@/components/ui/GradientOverlay";
import ExitConfirmationModal from "./../../../components/ui/modals/ExitConfirmationModal";

export default function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showExitModal, setShowExitModal] = useState(false);

  // Extract query parameters
  const currentItem = searchParams.get("job") || "defaultItem";
  const sessionId = searchParams.get("session") || null;

  useEffect(() => {
    // Block back navigation
    const handleBackNavigation = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.href);
    };

    // Disable F5, Ctrl+R, and context menu
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
      }
    };

    const disableContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackNavigation);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", disableContextMenu);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  const handleExit = () => {
    router.push("/"); // Redirect to home
  };

  const handleStay = () => {
    setShowExitModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GradientOverlay />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-[80vw] h-[70vh] overflow-hidden">
          <ChatInterface currentItem={currentItem} sessionId={sessionId} />
        </div>
      </div>

      {showExitModal && (
        <ExitConfirmationModal
          showModal={showExitModal}
          setShowModal={setShowExitModal}
          handleConfirmExit={handleExit}
        />
      )}
    </div>
  );
}
