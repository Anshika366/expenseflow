import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  BarChart3,
  TrendingDown,
  Wallet,
  AlertCircle,
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronDown,
  Check,
  Activity,
  Target,
} from "lucide-react";
import ChartsSection from "../components/ChartsSection";

export default function Reports() {
  const { state } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isReportsStatementPage = location.pathname === "/reports";

  const [dateFilter, setDateFilter] = useState("all");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const expenses = state.expenses || [];
  const totalExpenses = Number(state.totalExpenses) || 0;
  const rawRemaining = Number(state.remainingBalance) || 0;
  const totalTransactions = expenses.length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filteredExpenses = expenses.filter((exp) => {
    if (dateFilter === "all") return true;
    const expDate = new Date(exp.date || Date.now());
    const now = new Date();
    if (dateFilter === "month") {
      return (
        expDate.getMonth() === now.getMonth() &&
        expDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  const totalSpentFiltered = filteredExpenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  const filterOptions = [
    { value: "all", label: "All Time History" },
    { value: "month", label: "This Month" },
  ];

  const currentFilterObj =
    filterOptions.find((o) => o.value === dateFilter) || filterOptions[0];

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Category", "Date", "Method", "Amount"];
    const rows = filteredExpenses.map((e) => [
      e.id || "",
      `"${(e.name || e.title || "Expense").replace(/"/g, '""')}"`,
      e.category || "Others",
      e.date || "",
      e.paymentMethod || e.method || "Cash",
      e.amount || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ExpenseFlow_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isReportsStatementPage) {
    return (
      <div className="space-y-6 sm:space-y-7 pb-12 text-left font-sans text-slate-800 dark:text-slate-100 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#5B4CFF]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                <FileText size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
                Financial Reports & Statements
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Download CSV statement or print your expense report.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/45 hover:-translate-y-0.5 cursor-pointer transition-all"
            >
              {downloadSuccess ? <CheckCircle2 size={16} /> : <Download size={16} />}
              <span>{downloadSuccess ? "CSV Exported!" : "Export CSV"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial justify-center flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <Printer size={16} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 md:p-7 shadow-sm space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                <Filter size={15} />
              </div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Filter Transactions
              </h2>
            </div>

            <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full sm:w-auto justify-between sm:justify-start flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-800 dark:text-slate-100 hover:border-[#5B4CFF] dark:hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer"
              >
                <Calendar size={15} className="text-[#5B4CFF] dark:text-indigo-400" />
                <span>{currentFilterObj.label}</span>
                <ChevronDown
                  size={15}
                  className={`text-[#5B4CFF] dark:text-indigo-400 transition-transform duration-300 ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in duration-200 space-y-1">
                  {filterOptions.map((opt) => {
                    const isSelected = dateFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setDateFilter(opt.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#5B4CFF]"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={14} className="text-[#5B4CFF] dark:text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <div className="group relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-[#5B4CFF]/60 dark:hover:border-indigo-500/60 hover:shadow-[0_15px_35px_rgba(91,76,255,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  Total Transactions
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {filteredExpenses.length} Items
                </span>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <FileText size={18} />
              </div>
            </div>

            <div className="group relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-rose-500/60 dark:hover:border-rose-500/60 hover:shadow-[0_15px_35px_rgba(244,63,94,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  Total Amount Spent
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
                  ₹{totalSpentFiltered.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
                <TrendingDown size={18} />
              </div>
            </div>

            <div className="group relative overflow-hidden bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-[0_15px_35px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  Export Status
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 size={16} /> Ready to Download
                </span>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                <Download size={18} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <table className="w-full min-w-[550px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black text-[#0F172A] dark:text-white uppercase tracking-wider select-none">
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">#</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Title</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Category</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Date</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4">Method</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                      No transactions match the selected statement filter.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp, idx) => {
                    const badge = getCategoryDetails(exp.category);
                    return (
                      <tr
                        key={exp.id || idx}
                        className="hover:bg-[#F1F0FF]/60 dark:hover:bg-indigo-950/30 transition-all duration-200 group"
                      >
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-mono text-slate-400 group-hover:text-[#5B4CFF] transition-colors">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 font-extrabold text-slate-900 dark:text-white group-hover:text-[#5B4CFF] transition-colors">
                          {exp.name || exp.title || "Transaction"}
                        </td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] font-black border ${badge.style}`}>
                            <span>{badge.icon}</span>
                            <span>{exp.category || "Others"}</span>
                          </span>
                        </td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-[#5B4CFF] dark:text-indigo-300 font-extrabold">
                          {exp.date || "N/A"}
                        </td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-slate-600 dark:text-slate-300 font-bold">
                          {exp.paymentMethod || exp.method || "Cash"}
                        </td>
                        <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-right font-black text-rose-500 text-sm">
                          ₹{(Number(exp.amount) || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 text-left max-w-6xl mx-auto">
      <div className="space-y-1.5">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B4CFF] dark:text-indigo-400 hover:underline uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analytics & Financial Summary
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          Real-time breakdown of your category spending & overall balance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <ChartsSection
          categorySummary={categorySummary}
          totalExpenses={totalExpenses}
          getCategoryDetails={getCategoryDetails}
          expenses={expenses}
        />

        <div className="lg:col-span-6 bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm text-left flex flex-col justify-between space-y-6 sm:space-y-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#3B82F6]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 sm:space-y-7 relative z-10">
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm shrink-0">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Financial Overview
                  </h2>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Spent amount vs available balance
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between gap-3 shadow-sm group hover:border-rose-500/50 dark:hover:border-rose-500/50 hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)] dark:hover:shadow-[0_8px_30px_rgba(244,63,94,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                    Total Spent
                  </span>
                  <p className="text-xl sm:text-2xl font-extrabold text-rose-500 tracking-tight">
                    ₹{totalExpenses.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40 shrink-0">
                  <TrendingDown size={20} />
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between gap-3 shadow-sm group hover:border-[#5B4CFF]/50 dark:hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(91,76,255,0.12)] dark:hover:shadow-[0_8px_30px_rgba(91,76,255,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                    {isOverBudget ? "Remaining Balance (Over Budget)" : "Remaining Balance"}
                  </span>
                  <p
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isOverBudget ? "text-rose-500" : "text-[#5B4CFF] dark:text-indigo-400"
                    }`}
                  >
                    ₹{displayRemaining.toLocaleString("en-IN")}
                  </p>
                  {isOverBudget && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={13} /> Over budget limit by ₹{overspentAmount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                    isOverBudget
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-500 border-rose-100 dark:border-rose-900/40"
                      : "bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/40"
                  }`}
                >
                  <Wallet size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between gap-2 shadow-sm group hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                      Average / Expense
                    </span>
                    <p className="text-base font-extrabold text-amber-500">
                      ₹{avgTransaction.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shrink-0">
                    <Activity size={16} />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between gap-2 shadow-sm group hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                      Typical Expense
                    </span>
                    <p className="text-base font-extrabold text-emerald-500">
                      ₹{medianTransaction.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                    <Target size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40 rounded-2xl relative z-10 shadow-sm">
            <p className="text-xs font-semibold text-[#5B4CFF] dark:text-indigo-300 leading-relaxed">
              💡 You have recorded <span className="font-extrabold">{totalTransactions} transactions</span>. Your typical expense is <span className="font-extrabold">₹{medianTransaction.toLocaleString("en-IN")}</span> with an overall average of <span className="font-extrabold">₹{avgTransaction.toLocaleString("en-IN")}</span>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm text-left flex flex-col space-y-6 sm:space-y-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-56 h-56 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800/80 relative z-10 mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shadow-sm shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  Your latest transactions
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-4 relative z-10">
            {expenses.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 text-center py-8">
                No recent transactions.
              </p>
            ) : (
              <div className="space-y-3.5 sm:space-y-4">
                {[...expenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map((exp, index) => {
                    const catInfo = getCategoryDetails(exp.category);
                    return (
                      <div
                        key={exp.id || index}
                        className="p-3.5 sm:p-4 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex items-center justify-between gap-3 shadow-sm group hover:border-[#5B4CFF]/50 dark:hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(91,76,255,0.12)] dark:hover:shadow-[0_8px_30px_rgba(91,76,255,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border shrink-0 ${catInfo.style}`}
                          >
                            {catInfo.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {exp.name || exp.title || "Transaction"}
                            </p>
                            <p className="text-xs font-semibold text-slate-400">
                              {exp.date || "N/A"}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 font-extrabold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                          ₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
            
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 mt-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
