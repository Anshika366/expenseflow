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

  return (
    <div className="space-y-4 sm:space-y-7 pb-12 text-left font-sans text-slate-800 dark:text-slate-100 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#5B4CFF]/12 via-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#3B82F6] dark:text-blue-300 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-sm">
              <FileText size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Financial Reports & Statements
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Export official CSV statements, print financial reports, and inspect transactional logs.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/45 hover:-translate-y-0.5 cursor-pointer transition-all"
          >
            {downloadSuccess ? <CheckCircle2 size={16} /> : <Download size={16} />}
            <span>{downloadSuccess ? "CSV Exported!" : "Export CSV Statement"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 cursor-pointer transition-all hover:-translate-y-0.5"
          >
            <Printer size={16} />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm shrink-0">
              <Filter size={15} />
            </div>
            <h2 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Filter Statement Logs
            </h2>
          </div>

          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full sm:w-auto justify-between sm:justify-start flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-800 dark:text-slate-100 hover:border-[#5B4CFF] dark:hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#5B4CFF] dark:text-indigo-400 shrink-0" />
                <span>{currentFilterObj.label}</span>
              </div>
              <ChevronDown
                size={15}
                className={`text-[#5B4CFF] dark:text-indigo-400 transition-transform duration-300 shrink-0 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in duration-200 space-y-1">
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

        {/* Statement Summary KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Filtered Items
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {filteredExpenses.length} Transactions
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <FileText size={18} />
            </div>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Filtered Total
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
                ₹{totalSpentFiltered.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
              <TrendingDown size={18} />
            </div>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                Statement Status
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 size={15} /> Ready to Export
              </span>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Download size={18} />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <table className="w-full min-w-[500px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider select-none">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
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
                      <td className="py-4 px-4 font-mono text-slate-400 group-hover:text-[#5B4CFF] transition-colors">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-none group-hover:text-[#5B4CFF] transition-colors">
                        {exp.name || exp.title || "Transaction"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border ${badge.style}`}>
                          <span>{badge.icon}</span>
                          <span>{exp.category || "Others"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#5B4CFF] dark:text-indigo-300 font-extrabold whitespace-nowrap">
                        {exp.date || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">
                        {exp.paymentMethod || exp.method || "Cash"}
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
