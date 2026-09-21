import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  BarChart3,
  TrendingDown,
  Wallet,
  AlertCircle,
  Activity,
  Target,
  Sparkles,
  PieChart,
} from "lucide-react";
import ChartsSection from "../components/ChartsSection";

export default function Analytics() {
  const { state } = useApp();
  const navigate = useNavigate();

  const expenses = state.expenses || [];
  const totalExpenses = Number(state.totalExpenses) || 0;
  const rawRemaining = Number(state.remainingBalance) || 0;
  const totalTransactions = expenses.length;

  const validAmounts = expenses
    .map((e) => Number(e.amount) || 0)
    .filter((a) => a > 0)
    .sort((a, b) => a - b);

  const avgTransaction =
    totalTransactions > 0 ? Math.round(totalExpenses / totalTransactions) : 0;

  let medianTransaction = 0;
  if (validAmounts.length > 0) {
    const mid = Math.floor(validAmounts.length / 2);
    medianTransaction =
      validAmounts.length % 2 !== 0
        ? validAmounts[mid]
        : Math.round((validAmounts[mid - 1] + validAmounts[mid]) / 2);
  }

  const isOverBudget = rawRemaining < 0;
  const overspentAmount = Math.abs(rawRemaining);
  const displayRemaining = isOverBudget ? 0 : rawRemaining;

  const expenseMap = {};
  expenses.forEach((exp) => {
    const cat = exp.category || "Others";
    expenseMap[cat] = (expenseMap[cat] || 0) + Number(exp.amount || 0);
  });

  const categoryIconMap = {
    food: { icon: "🍕", gradient: "from-amber-400 to-orange-500", style: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" },
    shopping: { icon: "🛍️", gradient: "from-pink-500 to-rose-500", style: "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200/80 dark:border-pink-800/60" },
    bills: { icon: "⚡", gradient: "from-amber-500 to-yellow-500", style: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" },
    entertainment: { icon: "🎮", gradient: "from-purple-500 to-indigo-600", style: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60" },
    transport: { icon: "🚕", gradient: "from-[#5B4CFF] via-[#3B82F6] to-cyan-500", style: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60" },
    travel: { icon: "🚕", gradient: "from-[#5B4CFF] via-[#3B82F6] to-cyan-500", style: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60" },
    healthcare: { icon: "🏥", gradient: "from-rose-500 to-red-600", style: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60" },
    others: { icon: "📦", gradient: "from-slate-400 to-slate-600", style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60" },
  };

  const getCategoryDetails = (category) => {
    const key = (category || "").toLowerCase().trim();
    return (
      categoryIconMap[key] || {
        icon: "📦",
        gradient: "from-slate-400 to-slate-600",
        style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60",
      }
    );
  };

  const categorySummary = Object.keys(expenseMap)
    .map((cat) => ({
      name: cat,
      amount: expenseMap[cat],
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5B4CFF]/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-black text-[#5B4CFF] dark:text-indigo-400 hover:underline uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent mb-1"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 flex items-center justify-center border border-cyan-100 dark:border-cyan-900/40 shadow-sm">
              <PieChart size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Spending Analytics & Charts
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xl">
            Deep dive into your spending habits, category distribution, daily breakdown, and intelligent financial metrics.
          </p>
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-950/50 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-[#5B4CFF] dark:text-indigo-300">
          <Sparkles size={16} className="text-amber-500 animate-pulse" />
          <span>Real-time Ledger Sync</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[22px] shadow-sm hover:border-rose-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Spent
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-500 tracking-tight">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-semibold text-slate-400 block mt-1">
            Across {totalTransactions} logged items
          </span>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[22px] shadow-sm hover:border-[#5B4CFF]/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isOverBudget ? "Remaining (Over Budget)" : "Remaining Balance"}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isOverBudget
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-500 border-rose-100 dark:border-rose-900/40"
                  : "bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/40"
              }`}
            >
              <Wallet size={16} />
            </div>
          </div>
          <p
            className={`text-2xl font-black tracking-tight ${
              isOverBudget ? "text-rose-500" : "text-[#5B4CFF] dark:text-indigo-400"
            }`}
          >
            ₹{displayRemaining.toLocaleString("en-IN")}
          </p>
          {isOverBudget ? (
            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle size={13} /> Over by ₹{overspentAmount.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400 block mt-1">
              Safe budget threshold
            </span>
          )}
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[22px] shadow-sm hover:border-amber-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Avg / Transaction
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
              <Activity size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-500 tracking-tight">
            ₹{avgTransaction.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-semibold text-slate-400 block mt-1">
            Mean expenditure value
          </span>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-[22px] shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Typical Expense
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Target size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-500 tracking-tight">
            ₹{medianTransaction.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-semibold text-slate-400 block mt-1">
            Median transaction size
          </span>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <ChartsSection
          categorySummary={categorySummary}
          totalExpenses={totalExpenses}
          getCategoryDetails={getCategoryDetails}
          expenses={expenses}
        />
      </div>

      {/* Insights Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border border-indigo-200/60 dark:border-indigo-800/40 rounded-[24px] shadow-sm text-left">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5B4CFF] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <BarChart3 size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Financial Summary & Smart Insights
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              You have logged <span className="font-extrabold text-[#5B4CFF] dark:text-indigo-300">{totalTransactions} total transactions</span>. 
              {categorySummary.length > 0 && (
                <> Your top spending category is <span className="font-extrabold text-indigo-600 dark:text-indigo-300">{categorySummary[0].name} (₹{categorySummary[0].amount.toLocaleString("en-IN")})</span>.</>
              )} 
              {" "}Your median expense is <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{medianTransaction.toLocaleString("en-IN")}</span> with an average of <span className="font-extrabold text-amber-600 dark:text-amber-400">₹{avgTransaction.toLocaleString("en-IN")}</span> per transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
