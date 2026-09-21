import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  PieChart,
  Target,
  Sparkles,
  Edit2,
  ChevronDown,
  Check,
} from "lucide-react";

export default function Budgets() {
  const { state, updateCategoryBudgets } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [newBudgetLimit, setNewBudgetLimit] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const masterCategories = [
    "Food",
    "Shopping",
    "Travel",
    "Bills",
    "Education",
    "Entertainment",
    "Healthcare",
    "Fuel",
    "Rent",
    "Transport",
    "Others",
  ];

  const categoryIconMap = {
    Food: "🍕",
    Shopping: "🛍️",
    Travel: "✈️",
    Bills: "⚡",
    Education: "🎓",
    Entertainment: "🎮",
    Healthcare: "🏥",
    Fuel: "⛽",
    Rent: "🏠",
    Transport: "🚕",
    Others: "📦",
  };

  const defaultBudgets = {
    Food: 4000,
    Shopping: 3000,
    Travel: 2500,
    Bills: 5000,
    Education: 3000,
    Entertainment: 1500,
    Healthcare: 2500,
    Fuel: 2000,
    Rent: 8000,
    Transport: 2000,
    Others: 1000,
  };

  const categoryBudgets = {
    ...defaultBudgets,
    ...(state.categoryBudgets || {}),
  };

  const expenseCategories = (state.expenses || [])
    .map((e) => e.category)
    .filter(Boolean);

  const categories = Array.from(
    new Set([...masterCategories, ...Object.keys(categoryBudgets), ...expenseCategories])
  );

  const getSpentForCategory = (catName) => {
    const expenses = state.expenses || [];
    return expenses
      .filter((e) => (e.category || "").toLowerCase() === catName.toLowerCase())
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const totalBudget = categories.reduce((sum, cat) => sum + (categoryBudgets[cat] || 0), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + getSpentForCategory(cat), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = Math.min(Math.round((totalSpent / (totalBudget || 1)) * 100), 100);

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    const val = parseFloat(newBudgetLimit);
    if (!isNaN(val) && val >= 0) {
      const nextBudgets = { ...categoryBudgets, [selectedCategory]: val };
      await updateCategoryBudgets(nextBudgets);
      setNewBudgetLimit("");
      setIsDropdownOpen(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left font-sans text-slate-800 dark:text-slate-100 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-6 rounded-[28px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#5B4CFF]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
              <Target size={18} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Budget Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Set category limits, monitor real-time spending, and hit your monthly savings goals.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="relative z-10 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/45 hover:-translate-y-0.5 cursor-pointer transition-all shrink-0"
        >
          <Edit2 size={15} />
          <span>Adjust Budget Limits</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group relative overflow-hidden bg-gradient-to-br from-[#5B4CFF] via-indigo-600 to-[#3B82F6] text-white p-6 rounded-[28px] shadow-lg shadow-indigo-500/20 hover:shadow-[0_20px_45px_rgba(91,76,255,0.45)] dark:hover:shadow-[0_22px_55px_rgba(91,76,255,0.65)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[160px] cursor-pointer border border-indigo-400/40 ring-1 ring-white/20">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/20 dark:bg-white/30 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-175 opacity-40 group-hover:opacity-80" />
          <div className="relative z-10">
            <span className="text-xs font-black text-indigo-100 uppercase tracking-wider block mb-1">
              Total Allocated Budget
            </span>
            <div className="text-3xl font-black tracking-tight">₹{totalBudget.toLocaleString("en-IN")}</div>
          </div>
          <div className="relative z-10 flex items-center justify-between text-xs font-extrabold text-indigo-100 pt-4 border-t border-indigo-400/30">
            <span>Overall Cap</span>
            <span>100% Target</span>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-6 rounded-[28px] shadow-sm hover:border-rose-500/80 dark:hover:border-rose-500/80 hover:shadow-[0_18px_45px_rgba(244,63,94,0.25)] dark:hover:shadow-[0_20px_50px_rgba(244,63,94,0.4)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[160px] cursor-pointer">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/15 dark:bg-rose-500/30 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-70 group-hover:scale-175" />
          <div className="relative z-10">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
              Total Budget Spent
            </span>
            <div className="text-3xl font-black text-rose-500 tracking-tight">₹{totalSpent.toLocaleString("en-IN")}</div>
          </div>
          <div className="relative z-10 space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-extrabold text-slate-600 dark:text-slate-300">
              <span>Spent Progress</span>
              <span>{overallPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#5B4CFF] via-purple-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-6 rounded-[28px] shadow-sm hover:border-emerald-500/80 dark:hover:border-emerald-500/80 hover:shadow-[0_18px_45px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[160px] cursor-pointer">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 dark:bg-emerald-500/30 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-70 group-hover:scale-175" />
          <div className="relative z-10">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
              Remaining Allowance
            </span>
            <div className={`text-3xl font-black tracking-tight ${totalRemaining < 0 ? "text-rose-500" : "text-emerald-500"}`}>
              ₹{totalRemaining.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Sparkles size={16} />
            <span>{totalRemaining < 0 ? "Over Budget Warning!" : "On Track to Save Big!"}</span>
          </div>
        </div>
      </div>

      {/* Edit Category Limit Form */}
      {isEditing && (
        <div className="bg-white dark:bg-[#0B0F19] border border-indigo-300 dark:border-indigo-800/80 ring-1 ring-indigo-500/20 p-6 rounded-[28px] shadow-xl animate-card-entrance">
          <h3 className="text-sm font-black text-[#0F172A] dark:text-white mb-3">
            Update Category Limit
          </h3>
          <form onSubmit={handleUpdateBudget} className="flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[220px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:border-[#5B4CFF] focus:outline-none focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{categoryIconMap[selectedCategory] || "📦"}</span>
                  <span>{selectedCategory}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-[#5B4CFF]" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50 animate-in fade-in zoom-in duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = cat === selectedCategory;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{categoryIconMap[cat] || "📦"}</span>
                          <span>{cat}</span>
                        </div>
                        {isSelected && <Check size={16} className="text-[#5B4CFF]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <input
              type="number"
              placeholder="Enter new limit (₹)"
              value={newBudgetLimit}
              onChange={(e) => setNewBudgetLimit(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#5B4CFF] flex-1"
              required
            />

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#5B4CFF] hover:bg-indigo-700 text-white rounded-2xl text-xs font-black cursor-pointer transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Budget Cards */}
      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-[28px] p-6 md:p-7 shadow-sm">
        <h3 className="text-base font-black text-[#0F172A] dark:text-white mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
            <PieChart size={16} />
          </div>
          <span>Category-Wise Budget Limits</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((catName) => {
            const limit = categoryBudgets[catName] || 0;
            const spent = getSpentForCategory(catName);
            const rawPercent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : spent > 0 ? 100 : 0;
            const barWidthPercent = spent > 0 ? Math.max(5, rawPercent) : 0;
            const remaining = limit - spent;
            const icon = categoryIconMap[catName] || "📦";

            let statusBadge = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40";
            let statusText = "Safe";
            let gradientFill = "from-[#5B4CFF] to-[#3B82F6]";

            if (rawPercent >= 100 && limit > 0) {
              statusBadge = "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40";
              statusText = "Exceeded";
              gradientFill = "from-rose-500 to-red-600";
            } else if (rawPercent >= 75) {
              statusBadge = "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40";
              statusText = "Warning";
              gradientFill = "from-amber-400 to-amber-500";
            }

            return (
              <div
                key={catName}
                className="group relative overflow-hidden bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-2xl p-5 hover:border-[#5B4CFF] dark:hover:border-indigo-500 hover:shadow-[0_18px_45px_rgba(91,76,255,0.25)] dark:hover:shadow-[0_20px_50px_rgba(91,76,255,0.45)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B4CFF]/15 dark:bg-indigo-500/30 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-70 group-hover:scale-175" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{icon}</span>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {catName}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border ${statusBadge}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs font-extrabold mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Spent: ₹{spent.toLocaleString("en-IN")}</span>
                    <span className="text-slate-800 dark:text-slate-200">Limit: ₹{limit.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800 shadow-inner my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${gradientFill} group-hover:brightness-110`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] font-black pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-bold">{rawPercent}% Used</span>
                  <span className={remaining < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}>
                    {remaining < 0 ? `Over by ₹${Math.abs(remaining).toLocaleString("en-IN")}` : `₹${remaining.toLocaleString("en-IN")} Left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
