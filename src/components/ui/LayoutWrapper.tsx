"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Centralized route configuration
const ROUTE_CONFIG = [
  {
    route: "/interview",
    hideNavbar: true,
    hideFooter: true
  },
  {
    route: "/review",
    hideNavbar: false,
    hideFooter: false,
  },
];

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Find all matching route configurations
  const matchingRoutes = ROUTE_CONFIG.filter(config => 
    pathname.startsWith(config.route)
  );

  // Determine visibility based on matches
  const shouldHideNavbar = matchingRoutes.some(route => route.hideNavbar);
  const shouldHideFooter = matchingRoutes.some(route => route.hideFooter);

  return (
    <div className="relative flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="max-w-7xl mx-auto w-full">
        {children}
      </main>
      <div className="pt-12">
        {!shouldHideFooter && <Footer />}
      </div>
      
    </div>
  );
};

export default LayoutWrapper;