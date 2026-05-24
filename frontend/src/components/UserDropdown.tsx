"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dynamic state for the logged-in user
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    initials: "",
    role: "student",
    avatarColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  });

  useEffect(() => {
    // 1. Fetch from LocalStorage safely on the client
    const fullName = localStorage.getItem("full_name") || "Guest User";
    const email = localStorage.getItem("email") || "Not logged in";
    const role = localStorage.getItem("role") || "student";

    // 2. Generate Initials (e.g., "Shyantani Haldar" -> "SH")
    const nameParts = fullName.split(" ");
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : fullName.slice(0, 2).toUpperCase();

    // 3. Assign avatar colors dynamically based on role
    const avatarColor = role === "sme" 
      ? "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400"
      : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400";

    setUser({ name: fullName, email, initials, role, avatarColor });
  }, []);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Wipe local storage completely
    localStorage.clear();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-3 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${user.avatarColor}`}>
          {user.initials}
        </div>
        <svg className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50 ${
          isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
          <p className="text-xs font-medium text-zinc-500 truncate">{user.email}</p>
        </div>

        <div className="py-1.5">
          <Link 
            href={user.role === 'sme' ? '/business/profile' : '/student/profile'}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Edit Profile
          </Link>
          <Link 
            href={user.role === 'sme' ? '/business/billing' : '/student/earnings'}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {user.role === 'sme' ? 'Billing & Invoices' : 'Earnings & Payouts'}
          </Link>
        </div>

        <div className="border-t border-zinc-100 py-1.5 dark:border-zinc-800">
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}