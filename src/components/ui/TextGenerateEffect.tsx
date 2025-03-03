"use client";

import { useMemo, useLayoutEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = useMemo(() => words.split(" "), [words]);

  useLayoutEffect(() => {
    if (!scope.current) return;
    
    const startAnimation = async () => {
      await animate(
        ".animate-word",
        { opacity: 1 },
        { duration: 2, delay: stagger(0.2) }
      );
    };

    startAnimation();
  }, [animate, scope, wordsArray]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className={`animate-word ${
              idx > 4 ? "text-purple" : "dark:text-white text-black"
            } opacity-0`}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="dark:text-white text-black leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};