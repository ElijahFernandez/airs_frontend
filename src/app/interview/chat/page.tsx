"use client";

import ChatInterface from "@/components/ChatInterface";
import Navbar from "@/components/navbar";
import GradientOverlay from "@/components/ui/GradientOverlay";
import { useSearchParams } from "next/navigation";

export default function Chat() {
  const searchParams = useSearchParams(); // Get the search parameters
  const currentItem = searchParams.get("job") || "defaultItem"; // Use a default value if currentItem is null
  console.log(currentItem);

  return (
    <div className="min-h-screen flex flex-col">
      <GradientOverlay />
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-[80vw] h-[70vh] overflow-hidden">
          {/* Pass currentItem as a prop to ChatInterface */}
          <ChatInterface currentItem={currentItem} />
        </div>
      </div>
    </div>
  );
}
