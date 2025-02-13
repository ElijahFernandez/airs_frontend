// src/components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';  // Import Image from next/image for optimized image loading

const Navbar = () => {
  return (
    <nav className="bg-midlight text-white p-5 flex items-center justify-between relative
    border border-black/[0.2] dark:border-white/[0.2]  mx-auto  w-full">
      {/* Logo on the left */}
      <div className="flex items-center ml-5">
        <Link href="/">
          <Image
            src="/logos/airs-w-bgr.png"   // Path relative to the "public" folder
            alt="AIRS Logo"
            width={100}              // Adjust width as needed
            height={100}             // Adjust height as needed
          />
        </Link>
      </div>

      {/* Navbar Links */}
      <ul className="flex gap-20 mr-5">
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/paper">Paper</Link>
        </li>
        <li>
          <Link href="/policy">Policy</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
