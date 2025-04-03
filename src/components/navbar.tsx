// src/components/Navbar.tsx
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image for optimized image loading
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is loaded to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents flickering on first render

  return (
    <nav
      className="bg-backgroundgray text-foreground p-5 flex items-center justify-between relative
    border border-black/[0.2] dark:border-white/[0.2]  mx-auto h-full w-full"
    >
      {/* Logo on the left */}
      <div className="flex items-center ml-5">
        <Link href="/">
          <Image
            src={
              theme === "dark"
                ? "/logos/airs-w-bgr.png"
                : "/logos/airs-b-bgr.png"
            }
            alt="AIRS Logo"
            width={100}
            height={150}
            priority
            className="w-auto h-auto"
          />
        </Link>
      </div>

      {/* Navbar Links */}
      <ul className="flex items-center gap-20 mr-10">
        <li>
          <ThemeToggle /> {/* Dark/Light Mode Toggle */}
        </li>
        <div className="font-semibold flex items-center gap-20">
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/paper">Paper</Link>
          </li>
          <li>
            <Link href="/policy">Policy</Link>
          </li>
        </div>
      </ul>
    </nav>
  );  
};

export default Navbar;
