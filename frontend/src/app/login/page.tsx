"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LoginPage() {
  const formRef = useRef<HTMLDivElement>(null);
  
  // State for inputs and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Entrance Animation
  useEffect(() => {
    if (!formRef.current) return;
    createTimeline().add(formRef.current, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
    }, 100);
  }, []);

  // Reusable Eye Icon Component
  const EyeIcon = ({ show }: { show: boolean }) => (
    show ? (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    )
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col selection:bg-teal-500/30">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6">
        <div ref={formRef} className="w-full max-w-md opacity-0">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg shadow-teal-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">Log in to your SkillSync dashboard.</p>
          </div>

          {/* Login Form */}
          <form className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Password</label>
                <a href="#" className="text-xs font-bold text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <button type="button" className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:shadow-lg dark:bg-zinc-50 dark:text-zinc-900">
              Sign In
            </button>
            
          </form>

          {/* Footer Routing */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              New to the execution network?{" "}
              <Link href="/register" className="font-bold text-teal-600 hover:underline dark:text-teal-400">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}