"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BusinessRegister() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", companyName: "", email: ""
  });
  
  // State for password logic
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time validation rules
  const rules = [
    { id: "length", label: "At least 8 characters", valid: password.length >= 8 },
    { id: "upper", label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { id: "number", label: "One number", valid: /[0-9]/.test(password) },
    { id: "special", label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const isPasswordValid = rules.every(rule => rule.valid);

  useEffect(() => {
    if (!formRef.current) return;
    createTimeline().add(formRef.current, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
    }, 100);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) return setError("Please meet all password requirements.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setIsLoading(true);

    try {
      // Security Practice: Trim inputs to normalize data
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          company_name: formData.companyName.trim(),
          password: password,
          role: "sme"
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Registration failed");

      // Security & State Sync: Log the user in immediately
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("full_name", data.full_name);
      localStorage.setItem("email", data.email);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      router.push("/business/dashboard"); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create Business Account</h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">Start executing tasks instantly.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
            
            {error && (
              <div className="p-3 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl dark:bg-rose-900/10 dark:text-rose-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                <input 
                  required type="text" 
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Last Name</label>
                <input 
                  required type="text" 
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Company Name</label>
              <input 
                required type="text" 
                value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                placeholder="e.g. Aethon Grid"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Work Email</label>
              <input 
                required type="email" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                placeholder="founder@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
              <div className="relative">
                <input 
                  required type={showPassword ? "text" : "password"}
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
              
              {/* Animated Password Rules */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {rules.map((rule) => (
                  <div key={rule.id} className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 ${rule.valid ? "text-teal-600 dark:text-teal-400" : "text-zinc-400 dark:text-zinc-600"}`}>
                    <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${rule.valid ? "scale-100" : "scale-75"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      {rule.valid ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="3" />}
                    </svg>
                    {rule.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  required type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-teal-500" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="mt-6 w-full rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-75 disabled:hover:scale-100">
              {isLoading ? "Processing..." : "Initialize Account"}
            </button>
            
            <p className="mt-4 text-center text-xs font-medium text-zinc-500">
              By registering, you agree to our <span className="underline cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">Terms</span> and Escrow Policies.
            </p>
          </form>

          <div className="mt-8 text-center">
            <Link href="/register" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              ← Back to roles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}