"use client";

import React, { useEffect, useState, useCallback } from "react";

interface LinkedCard {
  id: string;
  brand: string;
  last4: string;
  is_default: boolean;
}

interface Transaction {
  id: string;
  description: string;
  client: string;
  date: string;
  amount: string;
  type: string;
  status: string;
  statusColor: string;
}

interface BillingData {
  available_balance: number;
  monthly_earnings: number;
  pending_payouts: number;
  is_stripe_connected: boolean;
  stripe_account_status: "unlinked" | "pending" | "active";
  linked_cards: LinkedCard[];
  transactions: Transaction[];
}

export default function StudentEarnings() {
  const [data, setData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const MOCK_STUDENT_ID = "002";

  const fetchBillingData = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/billing`);
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error loading account records:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const handleStripeConnect = async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/stripe/onboard`, {
        method: "POST"
      });
      if (response.ok) {
        const body = await response.json();
        window.location.href = body.url; // Forward to hosted secure onboarding screen
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenStripePortal = async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/stripe/dashboard`, {
        method: "POST"
      });
      if (response.ok) {
        const body = await response.json();
        window.open(body.url, "_blank");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!data || data.available_balance <= 0) return;
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/student/${MOCK_STUDENT_ID}/withdraw`, {
        method: "POST"
      });
      if (response.ok) {
        alert("Stripe Payout has been initiated successfully.");
        fetchBillingData();
      } else {
        const errJson = await response.json();
        alert(errJson.detail || "Withdrawal execution error.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
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
    <div className="mx-auto max-w-5xl p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Earnings & Payouts</h1>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">Manage your platform revenue and track pending funds.</p>
        </div>
        <button
          onClick={handleWithdrawal}
          disabled={isActionLoading || data.available_balance <= 0 || !data.is_stripe_connected}
          className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isActionLoading ? "Processing..." : "Withdraw Funds"}
        </button>
      </div>

      {/* Stripe Connection Setup Panel */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
              fill={"currentColor"} viewBox={"0 0 24 24"} className="text-[#635BFF]">
              {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
              <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z" />
            </svg>
            Stripe Transfer Setup
          </h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            {data.stripe_account_status === "active"
              ? "Your bank account and card distribution channel are fully operational through Stripe."
              : "Link a legal bank payout card destination via Stripe Secure infrastructure to clear available balances."}
          </p>
        </div>
        <div>
          {data.stripe_account_status === "active" ? (
            <button
              onClick={handleOpenStripePortal}
              disabled={isActionLoading}
              className="w-full sm:w-auto rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              Manage Payout Cards
            </button>
          ) : (
            <button
              onClick={handleStripeConnect}
              disabled={isActionLoading}
              className="w-full sm:w-auto rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#5249ea] transition-colors"
            >
              {data.stripe_account_status === "pending" ? "Resume Setup" : "Connect Stripe"}
            </button>
          )}
        </div>
      </div>

      {/* Financial Breakdown Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="h-16 w-16 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Available Balance</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-2">₹{data.available_balance.toLocaleString()}</p>
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-2 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            Ready for Deposit
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 relative overflow-hidden">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Lifetime Earnings</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-2">₹{data.monthly_earnings.toLocaleString()}</p>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-2">Total cleared revenue</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10 relative overflow-hidden">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Pending Payouts (Escrow)</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">₹{data.pending_payouts.toLocaleString()}</p>
          <p className="text-xs font-medium text-amber-700/70 dark:text-amber-500/70 mt-2">Awaiting client sign-off</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Recent Transactions</h2>
          <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">Download CSV</button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data.transactions.length === 0 ? (
            <p className="text-sm p-6 text-zinc-500 text-center font-medium">No recorded statements in processing ledger.</p>
          ) : (
            data.transactions.map((trx, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${trx.type === "Escrow Release" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d={trx.type === "Escrow Release" ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{trx.description}</p>
                    <p className="text-xs font-medium text-zinc-500">Processed for {trx.client} • {trx.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${trx.type === "Escrow Release" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>{trx.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}