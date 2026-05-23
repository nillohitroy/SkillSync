import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SkillSync | Hyperlocal Digital Execution",
  description: "Instantly, Affordably, Locally. Connecting SMEs with verified student talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${outfit.variable} font-sans antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        {/* The main content area expands to push the footer down if the page is short */}
        <div className="flex-1">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}