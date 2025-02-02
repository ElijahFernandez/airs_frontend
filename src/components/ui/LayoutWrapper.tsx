"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Define routes that should NOT have Navbar/Footer
  const hideLayoutOnRoutes = ["/interview/onboarding", "/interview/jobs", "/interview/chat"]; // add more routes to exclude navbar/footer/soon-to-be-created-layout-components

  const shouldHideLayout = hideLayoutOnRoutes.includes(pathname);

  return (
    <div className="relative flex flex-col min-h-screen">
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow max-w-7xl mx-auto px-5 sm:px-10">
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

export default LayoutWrapper;
