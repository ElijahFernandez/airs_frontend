// src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // Import the Image component
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is loaded to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null; // Prevents flickering on first render

  return (
    <footer className="bg-backgroundgray text-foreground border border-black/[0.2] dark:border-white/[0.2] py-8 w-full">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 pb-6">
          <div className="mb-4 md:mb-0">
            {theme === "dark" ? (
              <Image
                src="/logos/airs-w-bgr.png" // Path relative to the public folder
                alt="AIRS Logo"
                width={100} // Adjust width as needed
                height={150} // Adjust height as needed
                className="w-auto h-auto" // ✅ Ensures aspect ratio is maintained
              />
            ) : (
              <Image
                src="/logos/airs-b-bgr.png" // Path relative to the public folder
                alt="AIRS Logo"
                width={100} // Adjust width as needed
                height={150} // Adjust height as needed
                className="w-auto h-auto" // ✅ Ensures aspect ratio is maintained
              />
            )}
            {/* <Image
              src="/logos/airs-w-bgr.png" // Path relative to the public folder
              alt="AIRS Logo"
              width={100} // Adjust width as needed
              height={150} // Adjust height as needed
              className="w-auto h-auto" // ✅ Ensures aspect ratio is maintained
            /> */}
          </div>

          {/* Footer Links */}
          <ul className="flex gap-6">
            <li>
              <Link href="/about" className="hover:text-gray-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/paper" className="hover:text-gray-400">
                Paper
              </Link>
            </li>
            <li>
              <Link href="/policy" className="hover:text-gray-400">
                Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center mt-6 text-gray-400">
          <p>© {new Date().getFullYear()} AIRS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
