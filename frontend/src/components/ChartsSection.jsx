import { useState } from "react";
import { PieChart, BarChart3, ChevronDown, ChevronUp, Sparkles, TrendingUp } from "lucide-react";

export default function ChartsSection({
  categorySummary = [],
  totalExpenses = 0,
  getCategoryDetails,
  expenses = [],
}) {
  const [showAll, setShowAll] = useState(false);

  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  expenses.forEach((exp) => {
    if (exp.date) {
      const d = new Date(exp.date);
      if (!isNaN(d.getTime())) {
        const name = weekDays[d.getDay()];
        if (weekMap[name] !== undefined) {
          weekMap[name] += Number(exp.amount) || 0;
        }
      }
    }
  });

  const weeklyData = daysOrder.map((day) => ({
    day,
    amount: weekMap[day] || 0,
  }));

  const maxWeeklyAmount = Math.max(...weeklyData.map((w) => w.amount), 0);

  const displayedCategories = showAll
    ? categorySummary
    : categorySummary.slice(0, 4);

  const hasMore = categorySummary.length > 4;

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 text-left items-start">
      {/* Category Breakdown Card */}
      <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[36px] shadow-sm hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-all duration-500 text-left flex flex-col justify-between overflow-hidden min-h-[390px]">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-[#5B4CFF]/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-5 relative z-10">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B4CFF] to-[#8B5CF6] text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <PieChart size={19} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Category Breakdown
                  </h2>
                  <Sparkles size={13} className="text-amber-400 animate-pulse" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
                  Where your money was spent
                </span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-extrabold text-[#5B4CFF] dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/80 px-3 py-1.5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
              {categorySummary.length} Categories
            </span>
          </div>

          {categorySummary.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mx-auto flex items-center justify-center">
                <PieChart size={22} />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                No expense data recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="max-h-[250px] overflow-y-auto pr-1.5 space-y-3 custom-scrollbar">
                {displayedCategories.map((cat) => {
                  const catDetails = getCategoryDetails(cat.name);
                  const rawPercent =
                    totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
                  const displayPercent =
                    rawPercent > 0 && rawPercent < 1 ? "<1%" : `${Math.round(rawPercent)}%`;
                  const barWidthPercent =
                    cat.amount > 0 ? Math.max(6, Math.min(100, Math.round(rawPercent))) : 0;

                  return (
                    <div
                      key={cat.name}
                      className="space-y-2 group/item p-2.5 sm:p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-100/80 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-800/80 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300 cursor-default"
                    >
                      <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-base shrink-0 p-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                            {catDetails.icon}
                          </span>
                          <span className="font-bold truncate group-hover/item:text-[#5B4CFF] dark:group-hover/item:text-indigo-400 transition-colors duration-300">
                            {cat.name}
                          </span>
                          <span className="shrink-0 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded-lg group-hover/item:bg-[#5B4CFF]/15 group-hover/item:text-[#5B4CFF] dark:group-hover/item:bg-indigo-500/20 dark:group-hover/item:text-indigo-300 transition-all duration-300">
                            {displayPercent}
                          </span>
                        </div>
                        <span className="shrink-0 font-black text-slate-900 dark:text-white group-hover/item:text-[#5B4CFF] dark:group-hover/item:text-indigo-400 transition-colors duration-300">
                          ₹{cat.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="w-full h-3 bg-slate-200/60 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${catDetails.gradient} rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(99,102,241,0.35)] group-hover/item:brightness-125`}
                          style={{ width: `${barWidthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Show More / Show Less Toggle */}
        {hasMore && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 relative z-10 flex justify-center mt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[11px] font-black text-[#5B4CFF] dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-[#5B4CFF] hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm hover:shadow-md hover:shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
            >
              <span>{showAll ? "Show Top 4" : `View All (${categorySummary.length})`}</span>
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Weekly Spending Card */}
      <div className="group relative bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 p-5 sm:p-7 md:p-8 rounded-[28px] sm:rounded-[36px] shadow-sm hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)] hover:border-blue-400/40 dark:hover:border-blue-500/40 transition-all duration-500 text-left flex flex-col justify-between overflow-hidden min-h-[390px]">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-bl from-blue-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-[#5B4CFF]/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-5 relative z-10">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <BarChart3 size={19} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Weekly Spending
                  </h2>
                  <TrendingUp size={14} className="text-emerald-500" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500">
                  Daily expense pattern this week
                </span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-extrabold text-[#3B82F6] dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/80 px-3 py-1.5 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 shadow-sm">
              7 Days Active
            </span>
          </div>

          {maxWeeklyAmount === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mx-auto flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                No weekly spending data recorded yet.
              </p>
            </div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-3.5 pt-6">
              {weeklyData.map((w) => {
                const heightPercent =
                  maxWeeklyAmount > 0 ? Math.max(10, Math.round((w.amount / maxWeeklyAmount) * 100)) : 0;
                return (
                  <div key={w.day} className="flex-1 min-w-0 flex flex-col items-center gap-2 group/bar h-full justify-end cursor-default">
                    {/* Floating Price Tooltip */}
                    <div className="opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black shadow-lg shadow-indigo-500/20 whitespace-nowrap block">
                        ₹{w.amount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Bar Track & Fill */}
                    <div className="w-full h-full bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl flex items-end p-1 border border-slate-200/60 dark:border-slate-800/70 group-hover/bar:border-indigo-400/50 dark:group-hover/bar:border-indigo-500/50 group-hover/bar:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                      <div
                        className="w-full bg-gradient-to-t from-[#5B4CFF] via-[#3B82F6] to-cyan-400 rounded-xl transition-all duration-700 ease-out group-hover/bar:brightness-125 group-hover/bar:shadow-[0_0_18px_rgba(99,102,241,0.6)] group-hover/bar:scale-y-[1.02] origin-bottom"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover/bar:text-[#5B4CFF] dark:group-hover/bar:text-indigo-400 transition-colors duration-300">
                      {w.day}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
