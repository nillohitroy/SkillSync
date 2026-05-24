"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Safely handle theme and auth initialization on the client
  useEffect(() => {
    setMounted(true);
    
    // Theme Check
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Auth Check
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-zinc-50/80 backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-transform group-hover:scale-105">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">SkillSync</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden space-x-8 text-sm font-semibold md:block">
          <Link href="/features" className="text-zinc-600 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">Features</Link>
          <Link href="/docs" className="text-zinc-600 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">Documentation</Link>
          <Link href="/talent" className="text-zinc-600 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">For Talent</Link>
          <Link href="/pricing" className="text-zinc-600 transition-colors hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400">Pricing</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-zinc-500 transition-all hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          )}
          
          {mounted ? (
            isLoggedIn ? (
              <UserDropdown />
            ) : (
              <>
                <Link href="/login" className="hidden text-sm font-semibold text-zinc-900 dark:text-zinc-50 md:block hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="hidden rounded-lg bg-zinc-900 px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-105 dark:bg-zinc-50 dark:text-zinc-900 md:block">
                  Start Executing
                </Link>
              </>
            )
          ) : (
             <div className="w-24 h-8"></div> /* Placeholder to prevent layout shift before hydration */
          )}
        </div>
      </div>
    </header>
  );
}