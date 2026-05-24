"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createTimeline } from "animejs";

interface Transaction {
  id: string;
  date: string;
  description: string;
  client: string;
  type: string;
  amount: string;
  status: string;
  statusColor: string;
}

interface EarningsData {
  available_balance: number;
  locked_escrow: number;
  lifetime_earnings: number;
  transactions: Transaction[];
}

export default function StudentEarningsPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const MOCK_STUDENT_ID = "002"; // Match your student ID

  const fetchEarnings = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/student/${MOCK_STUDENT_ID}/earnings`);
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  useEffect(() => {
    if (isLoading || !contentRef.current) return;

    createTimeline().add(contentRef.current.children, {
      opacity: [0, 1],
      y: [20, 0],
      duration: 800,
      ease: "outExpo",
      delay: (el: any, i: number) => i * 100,
    }, 100);
  }, [isLoading]);

  const handleWithdrawal = async () => {
    if (!data || data.available_balance <= 0) {
      alert("You do not have any available funds to withdraw.");
      return;
    }

    setIsWithdrawing(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/student/${MOCK_STUDENT_ID}/withdraw`, {
        method: "POST"
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle explicit Stripe Connection Error
        if (responseData.detail && responseData.detail.includes("STRIPE_NOT_CONNECTED")) {
          alert("Action Required: Please complete your Stripe verification in Settings to connect your bank account.");
          return;
        }
        throw new Error(responseData.detail || "Withdrawal failed");
      }

      alert(`Success! A Stripe Payout of ₹${data.available_balance.toLocaleString()} has been initiated to your connected bank account.`);

      // Re-fetch the data to instantly update the UI balance and ledger
      await fetchEarnings();
    } catch (error: any) {
      console.error(error);
      alert(`Failed to process withdrawal: ${error.message}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <svg className="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main ref={contentRef} className="flex-1 p-6 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 opacity-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Earnings & Payouts</h1>
          <p className="text-sm font-medium text-zinc-500">Track your locked funds and manage direct deposits via Stripe.</p>
        </div>
        <button
          onClick={handleWithdrawal}
          disabled={isWithdrawing || data.available_balance <= 0}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#5249ea] hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isWithdrawing ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            // Stripe branding icon
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
              fill={"currentColor"} viewBox={"0 0 24 24"}>
              {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
              <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z" />
            </svg>
          )}
          {isWithdrawing ? 'Processing...' : 'Withdraw via Stripe'}
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10 opacity-0">

        {/* Available to Withdraw */}
        <div className="rounded-3xl border-2 border-[#635BFF]/20 bg-[#635BFF]/5 p-8 shadow-sm dark:border-[#635BFF]/30 dark:bg-[#635BFF]/10 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[#635BFF]/10 blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8881FF] mb-2">Available Balance</h3>
            <p className="text-5xl font-black text-zinc-900 dark:text-white mb-2">₹{data.available_balance.toLocaleString()}</p>
            <p className="text-sm font-medium text-[#635BFF]/80 dark:text-[#8881FF]/80">Ready for instant bank transfer</p>
          </div>
        </div>

        {/* Locked Escrow */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Locked in Escrow</h3>
          <p className="text-4xl font-black mb-2">₹{data.locked_escrow.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            Awaiting client sign-off
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Lifetime Earnings</h3>
          <p className="text-4xl font-black mb-2">₹{data.lifetime_earnings.toLocaleString()}</p>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total cleared revenue</p>
        </div>

      </div>

      {/* Ledger / Transaction History */}
      <div className="opacity-0">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Stripe Transaction Ledger
        </h2>

        {data.transactions.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-zinc-500 font-medium">Your ledger is currently empty. Complete tasks to earn funds.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Client / Destination</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {data.transactions.map((trx) => (
                    <tr key={trx.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-6 py-5">
                        <p className="font-bold text-zinc-900 dark:text-zinc-50 mb-0.5">{trx.description}</p>
                        <p className="text-xs font-medium text-zinc-500">{trx.date} • <span className="font-mono">{trx.id}</span></p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-medium text-zinc-600 dark:text-zinc-400">{trx.client}</p>
                        <p className="text-xs font-medium text-zinc-400">{trx.type}</p>
                      </td>
                      <td className="px-6 py-5 text-right font-black whitespace-nowrap">
                        <span className={trx.amount.startsWith('+') ? 'text-teal-600 dark:text-teal-400' : 'text-zinc-900 dark:text-zinc-50'}>
                          {trx.amount}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${trx.statusColor}`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
              <button className="text-sm font-bold text-[#635BFF] transition-colors hover:text-[#5249ea] dark:text-[#8881FF]">
                Download Full Ledger (.CSV)
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}