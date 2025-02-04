"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Define routes that should NOT have a Navbar
  const hideNavbarOnRoutes = ["/interview/onboarding", "/interview/jobs", "/interview/chat"];

  // Define routes that should NOT have a Footer
  const hideFooterOnRoutes = ["/review"]; // Example: "/review" has Navbar but no Footer

  const shouldHideNavbar = hideNavbarOnRoutes.some((route) => pathname.startsWith(route));
  const shouldHideFooter = hideFooterOnRoutes.some((route) => pathname.startsWith(route));

  return (
    <div className="relative flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="max-w-7xl mx-auto w-full">
        {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default LayoutWrapper;
