"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 transition"
    >
      {theme === "dark" ? (
        <Image
          src="/logos/whitesun.png"
          alt="Light Mode"
          width={24}
          height={24}
          style={{ width: "auto", height: "auto" }}
        />
      ) : (
        <Image
          src="/logos/darkmoon.png"
          alt="Dark Mode"
          width={24}
          height={24}
          style={{ width: "auto", height: "auto" }}

        />
      )}
    </button>
  );
};

export default ThemeToggle;
