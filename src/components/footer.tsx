// src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image"; // Import the Image component

const Footer = () => {
  return (
    <footer className="bg-midlight text-white py-8 w-full">
      <div className="max-w-5xl mx-auto px-4">
        {/* Top Section: Links */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-600 pb-6">
          {/* Logo/Brand */}
          <div className="mb-4 md:mb-0">
            {/* <h1 className="text-2xl font-bold">AIRS</h1> */}
            <Image
              src="/logos/airs-w-bgr.png" // Path relative to the public folder
              alt="AIRS Logo"
              width={100} // Adjust width as needed
              height={150} // Adjust height as needed
            />
          </div>

          {/* Footer Links */}
          <ul className="flex gap-6">
            <li>
              <Link href="#approach" className="hover:text-gray-400">
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
