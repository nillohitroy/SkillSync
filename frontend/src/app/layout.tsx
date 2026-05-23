import type { Metadata } from "next";
import { Outfit } from "next/font/google";
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
    // 1. Add suppressHydrationWarning to the html tag
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      {/* 2. Add suppressHydrationWarning to the body tag */}
      <body 
        className={`${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}