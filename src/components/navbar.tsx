// src/components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';  // Import Image from next/image for optimized image loading

const Navbar = () => {
  return (
    <nav className="bg-midnight2 text-white p-5 flex items-center justify-between z-50 relative">
      {/* Logo on the left */}
      <div className="flex items-center ml-5">
        <Image
          src="/logos/airs-w-bgr.png"   // Path relative to the "public" folder
          alt="AIRS Logo"
          width={100}              // Adjust width as needed
          height={100}             // Adjust height as needed
        />
      </div>

      {/* Navbar Links */}
      <ul className="flex gap-20 mr-5">
        <li>
          <Link href="/about">about</Link>
        </li>
        <li>
          <Link href="/paper">paper</Link>
        </li>
        <li>
          <Link href="/policy">policy</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
