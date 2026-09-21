import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  TrendingDown,
  Wallet,
  AlertCircle,
  Activity,
  Target,
  Sparkles,
  PieChart,
  Zap,
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
      {/* Glossy Header */}
      <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[36px] shadow-sm hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)] transition-all duration-500 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-[#5B4CFF]/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-xs font-black text-[#5B4CFF] dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent mb-1 group/btn"
            >
              <ArrowLeft size={15} className="group-hover/btn:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5B4CFF] via-[#3B82F6] to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <PieChart size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Spending Analytics</span>
                  <Sparkles size={20} className="text-amber-400 animate-pulse" />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Real-time visual insights, category distribution & intelligent ledger statistics.
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2.5 bg-slate-50/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Live Ledger Analytics
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards with Glowing Hover Accent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Spent */}
        <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] shadow-sm hover:shadow-[0_15px_35px_rgba(244,63,94,0.18)] hover:border-rose-400/50 dark:hover:border-rose-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-500/15 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Total Spent
            </span>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300">
              <TrendingDown size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight relative z-10">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mt-1 relative z-10">
            Across {totalTransactions} logged items
          </span>
        </div>

        {/* Remaining Balance */}
        <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] shadow-sm hover:shadow-[0_15px_35px_rgba(99,102,241,0.18)] hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-indigo-500/15 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {isOverBudget ? "Remaining (Over Limit)" : "Remaining Balance"}
            </span>
            <div
              className={`w-9 h-9 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${
                isOverBudget
                  ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30"
                  : "bg-gradient-to-br from-[#5B4CFF] to-[#8B5CF6] shadow-indigo-500/30"
              }`}
            >
              <Wallet size={18} />
            </div>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-black tracking-tight relative z-10 ${
              isOverBudget ? "text-rose-500" : "text-[#5B4CFF] dark:text-indigo-400"
            }`}
          >
            ₹{displayRemaining.toLocaleString("en-IN")}
          </p>
          {isOverBudget ? (
            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 relative z-10">
              <AlertCircle size={13} /> Over by ₹{overspentAmount.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mt-1 relative z-10">
              Available budget capacity
            </span>
          )}
        </div>

        {/* Avg per Transaction */}
        <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] shadow-sm hover:shadow-[0_15px_35px_rgba(245,158,11,0.18)] hover:border-amber-400/50 dark:hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/15 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Avg / Transaction
            </span>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight relative z-10">
            ₹{avgTransaction.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mt-1 relative z-10">
            Mean transaction cost
          </span>
        </div>

        {/* Typical Expense */}
        <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] shadow-sm hover:shadow-[0_15px_35px_rgba(16,185,129,0.18)] hover:border-emerald-400/50 dark:hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/15 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Typical Expense
            </span>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
              <Target size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight relative z-10">
            ₹{medianTransaction.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mt-1 relative z-10">
            Median spend threshold
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

      {/* Neon Insights Banner */}
      <div className="group relative p-6 bg-gradient-to-r from-indigo-600/15 via-purple-600/10 to-blue-600/15 dark:from-indigo-950/60 dark:via-purple-950/50 dark:to-blue-950/60 border border-indigo-200/80 dark:border-indigo-800/60 rounded-[28px] sm:rounded-[32px] shadow-sm hover:shadow-lg hover:shadow-indigo-500/15 transition-all duration-500 text-left overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B4CFF] to-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Zap size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Financial Intelligence Summary</span>
              <Sparkles size={16} className="text-amber-400 animate-spin" />
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              You have logged <span className="font-black text-[#5B4CFF] dark:text-indigo-300">{totalTransactions} total transactions</span>. 
              {categorySummary.length > 0 && (
                <> Your top spending area is <span className="font-black text-indigo-600 dark:text-indigo-300">{categorySummary[0].name} (₹{categorySummary[0].amount.toLocaleString("en-IN")})</span>.</>
              )} 
              {" "}Your typical expense is <span className="font-black text-emerald-600 dark:text-emerald-400">₹{medianTransaction.toLocaleString("en-IN")}</span> with an average of <span className="font-black text-amber-600 dark:text-amber-400">₹{avgTransaction.toLocaleString("en-IN")}</span> per item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
