import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import LayoutWrapper from "@/components/ui/LayoutWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A.I.R. System",
  description: "Automated Interview Review System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logos/airs-w-bgr.png" sizes="any" />
      </head>
      <body className={`${inter.className} bg-black-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap content in LayoutWrapper */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
