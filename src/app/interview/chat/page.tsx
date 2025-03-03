"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/app/interview/chat/components/ChatInterface";
import GradientOverlay from "@/components/ui/GradientOverlay";
import ExitConfirmationModal from "@/components/ui/modals/ExitConfirmationModal";
import FullscreenPromptModal from "@/components/ui/modals/FullscreenPromptModal";
import { AiOutlineHome } from "react-icons/ai"; // Import the Home icon
import SearchParamsHandler from "./components/SearchParamsHandler";

export default function Chat() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(true); // Show modal on render

  // const currentItem = searchParams.get("job") || "defaultItem";
  // const sessionId = searchParams.get("session") || null;

  useEffect(() => {
    const handleBackNavigation = (event: PopStateEvent) => {
      event.preventDefault();
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.href);
    };

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
    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          console.log("Exited fullscreen mode before redirecting");
          router.push("/");
        })
        .catch((err) => {
          console.error("Error exiting fullscreen:", err);
          router.push("/"); // Redirect even if exiting fullscreen fails
        });
    } else {
      router.push("/");
    }
  };

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      console.log("Entered fullscreen mode");
      setShowFullscreenModal(false); // Close modal only if fullscreen is active
    } else {
      setShowExitModal(true);
      console.log("Exited fullscreen mode");
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false); // Close modal

    // Only re-enter fullscreen if still on the Chat page
    if (window.location.pathname === "/interview/chat") {
      enableFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enableFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          console.log("Fullscreen request successful");
        })
        .catch((err) => {
          console.error("Fullscreen error:", err);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GradientOverlay />
      {/* Home Icon Button */}
      <div>
        <button
          className="fixed top-6 left-6 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 shadow"
          onClick={() => {
            setShowExitModal(true);
          }}
        >
          <AiOutlineHome className="text-3xl text-gray-800 dark:text-gray-200" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-[80vw] h-[70vh] overflow-hidden">
          <Suspense fallback={<div>Loading chat...</div>}>
            <SearchParamsHandler>
              {({ job, session }) => (
                <ChatInterface currentItem={job} sessionId={session} />
              )}
            </SearchParamsHandler>
          </Suspense>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreenModal && (
        <FullscreenPromptModal
          showModal={showFullscreenModal}
          setShowModal={setShowFullscreenModal}
          handleConfirm={enableFullscreen}
        />
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <ExitConfirmationModal
          showModal={showExitModal}
          setShowModal={setShowExitModal}
          handleConfirmExit={handleExit}
          handleCancel={handleCancelExit}
        />
      )}
    </div>
  );
}
