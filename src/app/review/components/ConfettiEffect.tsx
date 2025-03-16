"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ConfettiEffect() {
  const { width, height } = useWindowSize();
  const [numPieces, setNumPieces] = useState(300);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      
      // Start reducing confetti pieces after initial 2 seconds
      const fadeOutInterval = setInterval(() => {
        setNumPieces((prev) => Math.max(prev - 15, 0));
      }, 100);

      // Cleanup interval after 2 seconds of fade-out
      setTimeout(() => clearInterval(fadeOutInterval), 2000);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={numPieces}
      recycle={!isFading}
    />
  );
}