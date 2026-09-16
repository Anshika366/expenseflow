import { PieChart, BarChart3 } from "lucide-react";

export default function ChartsSection({
  categorySummary = [],
  totalExpenses = 0,
  getCategoryDetails,
  expenses = [],
}) {
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

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-7 md:p-8 rounded-[32px] shadow-sm text-left space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#5B4CFF]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
              <PieChart size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Category Breakdown
              </h2>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Where your money was spent
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#5B4CFF] dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
            {categorySummary.length} Categories
          </span>
        </div>

        {categorySummary.length === 0 ? (
          <p className="text-xs font-semibold text-slate-400 py-8 text-center">
            No expense data recorded yet.
          </p>
        ) : (
          <div className="space-y-5 relative z-10">
            {categorySummary.map((cat) => {
              const catDetails = getCategoryDetails(cat.name);
              const rawPercent =
                totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
              const displayPercent =
                rawPercent > 0 && rawPercent < 1 ? "<1%" : `${Math.round(rawPercent)}%`;
              const barWidthPercent =
                cat.amount > 0 ? Math.max(6, Math.min(100, Math.round(rawPercent))) : 0;

              return (
                <div key={cat.name} className="space-y-2 group p-3 -mx-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:shadow-sm hover:shadow-[#5B4CFF]/5 dark:hover:shadow-indigo-500/10 transition-all cursor-default">
                  <div className="flex justify-between text-xs font-extrabold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base transform group-hover:scale-110 transition-transform duration-300">{catDetails.icon}</span>
                      <span className="font-bold group-hover:text-[#5B4CFF] dark:group-hover:text-indigo-400 transition-colors duration-300">{cat.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md group-hover:bg-[#5B4CFF]/10 group-hover:text-[#5B4CFF] dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-300 transition-colors duration-300">
                        {displayPercent}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#5B4CFF] dark:group-hover:text-indigo-400 transition-colors duration-300">
                      ₹{cat.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800/80 shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${catDetails.gradient} rounded-full transition-all duration-700 ease-out group-hover:brightness-125`}
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-7 md:p-8 rounded-[32px] shadow-sm text-left space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#3B82F6]/10 via-[#5B4CFF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#3B82F6] dark:text-blue-300 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-sm">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Weekly Spending
              </h2>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Daily expense pattern this week
              </span>
            </div>
          </div>
        </div>

        {maxWeeklyAmount === 0 ? (
          <p className="text-xs font-semibold text-slate-400 py-12 text-center">
            No weekly spending data available.
          </p>
        ) : (
          <div className="h-48 flex items-end justify-between gap-3 pt-6 relative z-10">
            {weeklyData.map((w) => {
              const heightPercent =
                maxWeeklyAmount > 0 ? Math.max(8, Math.round((w.amount / maxWeeklyAmount) * 100)) : 0;
              return (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-default">
                  <span className="text-[10px] font-black text-[#5B4CFF] dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    ₹{w.amount}
                  </span>
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-end p-1 border border-slate-100 dark:border-slate-800/60 group-hover:border-[#5B4CFF]/30 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                    <div
                      className="w-full bg-gradient-to-t from-[#5B4CFF] to-[#3B82F6] rounded-xl transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(91,76,255,0.4)]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#5B4CFF] dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
