import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  ChevronDown,
  Check,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function Reports() {
  const { state } = useApp();

  const [dateFilter, setDateFilter] = useState("all");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const expenses = state.expenses || [];

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

  const categoryIconMap = {
    food: { icon: "🍕", style: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" },
    shopping: { icon: "🛍️", style: "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200/80 dark:border-pink-800/60" },
    bills: { icon: "⚡", style: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60" },
    entertainment: { icon: "🎮", style: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60" },
    transport: { icon: "🚕", style: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60" },
    travel: { icon: "🚕", style: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60" },
    healthcare: { icon: "🏥", style: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60" },
    others: { icon: "📦", style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60" },
  };

  const getCategoryDetails = (category) => {
    const key = (category || "").toLowerCase().trim();
    return (
      categoryIconMap[key] || {
        icon: "📦",
        style: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60",
      }
    );
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (dateFilter === "all") return true;
    if (!exp.date) return false;
    const expDate = new Date(exp.date);
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
      e.payment_method || e.paymentMethod || e.method || "UPI",
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

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 text-left font-sans text-slate-800 dark:text-slate-100 max-w-6xl mx-auto">
      <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[36px] shadow-sm hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)] transition-all duration-500 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-blue-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-[#5B4CFF]/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3B82F6] via-[#5B4CFF] to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Financial Statements & Reports</span>
                  <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Export official CSV statements, print reports, and inspect transaction ledgers.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={handleExportCSV}
              className="w-full sm:w-auto justify-center flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#5B4CFF] via-[#3B82F6] to-cyan-500 hover:from-[#4C3DE6] hover:to-[#2563EB] text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:scale-95 cursor-pointer transition-all duration-300"
            >
              {downloadSuccess ? <CheckCircle2 size={18} /> : <Download size={18} />}
              <span>{downloadSuccess ? "CSV Exported!" : "Export CSV Statement"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto justify-center flex items-center gap-2.5 px-5 py-3.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer transition-all duration-300"
            >
              <Printer size={18} />
              <span>Print Statement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-sm shrink-0">
              <Filter size={18} />
            </div>
            <div>
              <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Filter Statement Logs
              </h2>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Select custom date range
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto justify-between sm:justify-start flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-900 dark:text-slate-100 hover:border-[#5B4CFF] dark:hover:border-indigo-500 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#5B4CFF] dark:text-indigo-400 shrink-0" />
                <span>{currentFilterObj.label}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#5B4CFF] dark:text-indigo-400 transition-transform duration-300 shrink-0 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-52 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 space-y-1">
                {filterOptions.map((opt) => {
                  const isSelected = dateFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setDateFilter(opt.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#F1F0FF] dark:bg-indigo-950/80 text-[#5B4CFF] dark:text-indigo-300 shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-[#5B4CFF]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={15} className="text-[#5B4CFF] dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Filtered Items
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {filteredExpenses.length} Items
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform">
              <FileText size={19} />
            </div>
          </div>

          <div className="group bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Filtered Total
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
                ₹{totalSpentFiltered.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40 group-hover:scale-110 transition-transform">
              <TrendingDown size={19} />
            </div>
          </div>

          <div className="group bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Statement Status
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 size={16} /> Verified & Ready
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-110 transition-transform">
              <Download size={19} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <table className="w-full min-w-[550px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider select-none">
                <th className="py-4 px-4">#</th>
                <th className="py-4 px-4">Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Method</th>
                <th className="py-4 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400 font-bold">
                    No transactions match the selected statement filter.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp, idx) => {
                  const badge = getCategoryDetails(exp.category);
                  return (
                    <tr
                      key={exp.id || idx}
                      className="hover:bg-[#F1F0FF]/70 dark:hover:bg-indigo-950/40 transition-all duration-200 group relative"
                    >
                      <td className="py-4 px-4 font-mono text-slate-400 group-hover:text-[#5B4CFF] dark:group-hover:text-indigo-400 transition-colors">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-none group-hover:text-[#5B4CFF] dark:group-hover:text-indigo-400 transition-colors">
                        {exp.name || exp.title || "Transaction"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border ${badge.style}`}>
                          <span>{badge.icon}</span>
                          <span>{exp.category || "Others"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#5B4CFF] dark:text-indigo-300 font-black whitespace-nowrap">
                        {exp.date || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-extrabold whitespace-nowrap">
                        {exp.payment_method || exp.paymentMethod || exp.method || "UPI"}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-rose-500 text-sm whitespace-nowrap">
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
