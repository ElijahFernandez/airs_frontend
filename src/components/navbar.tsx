// src/components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';  // Import Image from next/image for optimized image loading

const Navbar = () => {
  return (
    <nav className="bg-midnlight text-white p-5 flex items-center justify-between z-50 relative 
    border border-black/[0.2] dark:border-white/[0.2] rounded-2xl max-w-4xl mx-auto mt-5">
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
          <Link href="#approach">about</Link>
        </li>
        {/* <li>
          <Link href="/paper">paper</Link>
        </li>
        <li>
          <Link href="/policy">policy</Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
