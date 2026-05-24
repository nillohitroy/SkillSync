"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Added for auth redirect

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

interface Invoice {
  id: string;
  title: string;
  date: string;
  amount: number;
}

interface BillingData {
  active_escrow: number;
  active_jobs_count: number;
  payment_methods: PaymentMethod[];
  recent_invoices: Invoice[];
}

export default function BusinessBilling() {
  const router = useRouter();
  const [data, setData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
          router.push('/login');
          return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/business/${userId}/billing`, {
          headers: {
              "Content-Type": "application/json",
              "x-user-id": userId // Required security header
          }
      });
      
      if (!response.ok) {
          if (response.status === 403) throw new Error("Permission Denied.");
          throw new Error("Failed to load billing data.");
      }
      
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      console.error("Error loading billing data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const handleOpenStripePortal = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    setIsPortalLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/business/${userId}/stripe/portal`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": userId // Required security header
        }
      });
      
      if (response.ok) {
        const body = await response.json();
        window.location.href = body.url; // Secure redirect to Stripe
      } else {
        alert("Failed to connect to Stripe portal.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error connecting to Stripe.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 h-[80vh]">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex flex-1 items-center justify-center p-6 h-[80vh] text-rose-500 font-bold text-center">
            {error}
        </div>
     );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Billing & Escrow</h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Manage your payment methods, escrow funds, and job invoices.</p>
        </div>
        <button
          onClick={handleOpenStripePortal}
          disabled={isPortalLoading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-75 flex items-center gap-2"
        >
          {isPortalLoading ? "Connecting..." : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z" />
              </svg>
              Manage Billing via Stripe
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Funds in Escrow */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10 relative overflow-hidden md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wider">Active Escrow Funds</p>
              <p className="text-3xl font-black text-blue-800 dark:text-blue-400 mt-2">₹{data.active_escrow.toLocaleString()}</p>
              <p className="text-xs font-medium text-blue-700/70 dark:text-blue-500/70 mt-2">
                Locked across {data.active_jobs_count} active job{data.active_jobs_count !== 1 && 's'}. Funds release upon your digital sign-off.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/50">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Platform Plan</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">Free Tier</p>
            <p className="text-xs text-zinc-500 mt-1">Pay-as-you-go per execution.</p>
          </div>
          <button className="mt-4 w-full rounded-md bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20 transition-colors border border-teal-200 dark:border-teal-500/20">
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Payment Methods</h2>
          </div>
          <div className="p-6 space-y-4">

            {data.payment_methods.length === 0 ? (
              <p className="text-sm text-zinc-500">No payment methods configured securely.</p>
            ) : (
              data.payment_methods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 rounded bg-zinc-100 flex items-center justify-center font-bold text-xs text-blue-900 dark:bg-zinc-800 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700">
                      {pm.brand}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{pm.brand} ending in {pm.last4}</p>
                      <p className="text-xs text-zinc-500">Expires {pm.exp_month}/{pm.exp_year}</p>
                    </div>
                  </div>
                  {pm.is_default && (
                    <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Default</span>
                  )}
                </div>
              ))
            )}

            <button
              onClick={handleOpenStripePortal}
              className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 w-full text-left"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add new card or UPI securely
            </button>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Recent Sign-Offs</h2>
            <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">View All</button>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">

            {data.recent_invoices.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500">No recent invoice history.</p>
            ) : (
              data.recent_invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{inv.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Signed off • {inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">₹{inv.amount.toLocaleString()}</p>
                    <button className="text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400">Invoice</button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
}