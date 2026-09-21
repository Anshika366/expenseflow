import { useState } from "react";

export default function HeroSection({
  isDarkMode,
  navigate,
  expenses,
  inputTitle,
  setInputTitle,
  inputCategory,
  setInputCategory,
  inputAmount,
  setInputAmount,
  handleAddNewExpense,
}) {
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryOptions = [
    { label: "Food", icon: "🍔" },
    { label: "Travel", icon: "🚗" },
    { label: "Shopping", icon: "🛍️" },
    { label: "Bills", icon: "🎬" },
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-8 lg:px-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-8 lg:my-0">
      <div className="lg:col-span-5 space-y-5 text-left">
        <div
          className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider transition-all duration-500 ease-in-out ${
            isDarkMode
              ? "bg-purple-950/40 border-purple-900/60 text-purple-400"
              : "bg-[#EEF2F6] border-slate-200/40 text-[#6366F1]"
          }`}
        >
          # PERSONAL EXPENSE MANAGEMENT SYSTEM
        </div>

        <h1
          className={`text-4xl lg:text-[52px] leading-[1.1] font-extrabold tracking-tight transition-colors duration-500 ease-in-out ${
            isDarkMode ? "text-white" : "text-[#0F172A]"
          }`}
        >
          Smart{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500 bg-clip-text text-transparent">
            Expense
          </span>{" "}
          <br />
          Management <br />
          Made Beautiful.
        </h1>

        <p
          className={`text-xs lg:text-sm leading-relaxed max-w-[430px] transition-colors duration-500 ease-in-out ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Track every expense, manage your budget, visualize spending, and
          stay financially organized through one intelligent dashboard.
        </p>

        <div className="flex items-center pt-2">
          <button
            onClick={() => navigate("/auth")}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Get Started <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 flex items-center justify-center relative w-full py-4 max-h-[500px] group/container">
        <div className="absolute top-[8%] left-[6%] z-30 animate-float-wallet">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center w-11 h-11 transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-0 cursor-pointer ${
              isDarkMode
                ? "bg-slate-900/60 border border-slate-800 text-purple-400 backdrop-blur-md shadow-badge-dark"
                : "bg-[#F3E8FF] border border-white/90 text-[#8B5CF6] backdrop-blur-md shadow-wallet-badge-light"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 0 3 18v-6m18 0V9M3 12V9m18-1.001V4.5A2.25 2.25 0 0 0 18.75 2.25H5.25A2.25 2.25 0 0 0 3 4.5v3.499"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-[-2%] right-[18%] z-30 animate-float-pie">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center w-11 h-11 transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-0 cursor-pointer ${
              isDarkMode
                ? "bg-slate-900/60 border border-slate-800 text-indigo-400 backdrop-blur-md shadow-badge-dark"
                : "bg-[#EDE9FE] border border-white/90 text-[#7C3AED] backdrop-blur-md shadow-pie-badge-light"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-[18%] left-[-4%] z-30 animate-float-bars">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center w-11 h-11 transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-0 cursor-pointer ${
              isDarkMode
                ? "bg-slate-900/60 border border-slate-800 text-blue-400 backdrop-blur-md shadow-badge-dark"
                : "bg-[#E0F2FE] border border-white/90 text-[#0284C7] backdrop-blur-md shadow-bars-badge-light"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-[2%] right-[16%] z-30 animate-float-rupee">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center w-11 h-11 text-base font-extrabold transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-0 cursor-pointer ${
              isDarkMode
                ? "bg-slate-900/60 border border-slate-800 text-emerald-400 backdrop-blur-md shadow-badge-dark"
                : "bg-[#E6F4EA] border border-white/90 text-[#10B981] backdrop-blur-md shadow-rupee-badge-light"
            }`}
          >
            ₹
          </div>
        </div>

        <div
          className={`w-full max-w-[530px] border rounded-[28px] p-5 z-20 transition-all duration-700 cubic-bezier(0.16,1,0.3,1) hover:-translate-y-1 hover:scale-[1.006] ${
            isDarkMode
              ? "bg-[#0B0F19]/90 border-slate-800/80 backdrop-blur-xl mockup-dashboard-shadow-dark"
              : "bg-white/95 border-white backdrop-blur-xl mockup-dashboard-shadow-light"
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-3 mb-4 transition-colors duration-500 ease-in-out ${
              isDarkMode ? "border-slate-800/60" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366F1]" />
              <span
                className={`text-[11px] font-bold tracking-wide transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-slate-300" : "text-slate-800"
                }`}
              >
                Dashboard Preview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRangeOpen((prev) => !prev)}
                  className={`text-[9.5px] border px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer transition-all duration-300 ${
                    isDarkMode
                      ? "bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-indigo-500"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  <span>{selectedRange}</span>
                  <span className="text-[8px] opacity-70">▼</span>
                </button>

                {isRangeOpen && (
                  <div
                    className={`absolute top-full right-0 mt-1.5 w-32 rounded-xl border p-1 shadow-xl z-50 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-[#0B0F19] border-slate-800 text-slate-200"
                        : "bg-white border-slate-100 text-slate-800"
                    }`}
                  >
                    {["This Month", "Last 30 Days", "This Quarter", "This Year"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedRange(opt);
                          setIsRangeOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${
                          selectedRange === opt
                            ? "bg-indigo-500/15 text-indigo-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-slate-500 font-extrabold cursor-pointer text-xs pb-0.5">
                ⋮
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div
              className={`p-3 rounded-xl border transition-colors duration-500 ease-in-out ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-800/60"
                  : "bg-slate-50/40 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider">
                  Total Funds
                </span>
                <span
                  className={`w-4 h-4 rounded text-[9px] flex items-center justify-center transition-colors duration-500 ease-in-out ${
                    isDarkMode
                      ? "bg-emerald-950/40 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  💼
                </span>
              </div>
              <div className="text-[14px] font-extrabold text-[#10B981]">
                ₹50,000
              </div>
              <span className="text-[7.5px] text-[#10B981] font-bold block mt-0.5">
                ▲ 12.5%{" "}
                <span className="text-slate-500 font-normal text-[7px]">
                  last mo
                </span>
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors duration-500 ease-in-out ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-800/60"
                  : "bg-slate-50/40 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider">
                  Total Expenses
                </span>
                <span
                  className={`w-4 h-4 rounded text-[9px] flex items-center justify-center transition-colors duration-500 ease-in-out ${
                    isDarkMode
                      ? "bg-rose-950/40 text-rose-400"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  💳
                </span>
              </div>
              <div className="text-[14px] font-extrabold text-[#E5484D]">
                ₹18,500
              </div>
              <span className="text-[7.5px] text-[#E5484D] font-bold block mt-0.5">
                ▼ 8.7%{" "}
                <span className="text-slate-500 font-normal text-[7px]">
                  last mo
                </span>
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border transition-colors duration-500 ease-in-out ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-800/60"
                  : "bg-slate-50/40 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-bold text-slate-400 tracking-wider">
                  Remaining
                </span>
                <span
                  className={`w-4 h-4 rounded text-[9px] flex items-center justify-center transition-colors duration-500 ease-in-out ${
                    isDarkMode
                      ? "bg-indigo-950/40 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  📉
                </span>
              </div>
              <div className="text-[14px] font-extrabold text-[#38BDF8]">
                ₹31,500
              </div>
              <span className="text-[7.5px] text-[#38BDF8] font-bold block mt-0.5">
                ▲ 15.4%{" "}
                <span className="text-slate-500 font-normal text-[7px]">
                  last mo
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            <div
              className={`md:col-span-5 p-3 rounded-2xl border flex flex-col items-center justify-center transition-colors duration-500 ease-in-out relative ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-800/60"
                  : "bg-slate-50/40 border-slate-100"
              }`}
            >
              <div className="text-[9px] font-bold text-slate-400 mb-1 tracking-wider uppercase">
                Expense Overview
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isDarkMode ? "#1E293B" : "#E2E8F0"}
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5B4CFF"
                    strokeWidth="3.8"
                    strokeDasharray="45, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.8"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-45"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3.8"
                    strokeDasharray="18, 100"
                    strokeDashoffset="-70"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[7px] text-slate-400 font-bold uppercase">
                    Total
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-900 dark:text-white">
                    ₹18,500
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-1.5 max-h-[135px] overflow-y-auto pr-1 custom-scrollbar">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1 px-1">
                <span>Recent Expenses</span>
                <span className="text-indigo-400 cursor-pointer hover:underline">
                  View All
                </span>
              </div>
              {expenses.slice(0, 2).map((exp) => (
                <div
                  key={exp.id}
                  className={`p-1.5 rounded-xl border flex items-center justify-between transition-all duration-200 hover:scale-[1.01] ${
                    isDarkMode
                      ? "bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/40"
                      : "bg-slate-50/60 border-slate-100 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg text-[10px] flex items-center justify-center shadow-sm ${
                        isDarkMode ? "bg-slate-800/80" : "bg-white"
                      }`}
                    >
                      {exp.iconText}
                    </div>
                    <div className="text-left">
                      <div
                        className={`text-[9.5px] font-bold ${
                          isDarkMode ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {exp.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[7.5px] text-slate-400 font-medium">
                      {exp.date}
                    </span>
                    <span className="text-[9.5px] font-extrabold text-[#E5484D]">
                      -₹{Number(exp.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleAddNewExpense}
            className={`p-2.5 rounded-2xl border transition-colors duration-500 ease-in-out ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800/80"
                : "bg-slate-50 border-slate-200/80"
            }`}
          >
            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                required
                placeholder="Add a new expense..."
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className={`col-span-5 text-[10px] px-2.5 py-1.5 rounded-xl border focus:outline-none focus:border-indigo-500 transition-colors font-medium ${
                  isDarkMode
                    ? "bg-[#060814] border-slate-700 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <input
                type="number"
                placeholder="₹"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className={`col-span-2 text-[10px] px-2 py-1.5 rounded-xl border focus:outline-none focus:border-indigo-500 transition-colors font-bold ${
                  isDarkMode
                    ? "bg-[#060814] border-slate-700 text-white placeholder-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <div className="col-span-3 relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className={`w-full text-[10px] px-2 py-1.5 rounded-xl border flex items-center justify-between font-semibold focus:outline-none cursor-pointer transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#060814] border-slate-700 text-slate-200 hover:border-indigo-500"
                      : "bg-white border-slate-300 text-slate-800 hover:border-indigo-400"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{categoryOptions.find((c) => c.label === inputCategory)?.icon || "💰"}</span>
                    <span>{inputCategory}</span>
                  </span>
                  <span className={`text-[8px] opacity-70 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {isCategoryOpen && (
                  <div
                    className={`absolute bottom-full left-0 mb-1.5 w-full rounded-xl border p-1 shadow-2xl z-50 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-[#0B0F19] border-slate-800 text-slate-200"
                        : "bg-white border-slate-100 text-slate-800"
                    }`}
                  >
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => {
                          setInputCategory(cat.label);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[9.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          inputCategory === cat.label
                            ? "bg-indigo-500/15 text-indigo-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="col-span-2 py-1.5 bg-[#5B4CFF] hover:bg-[#4C3DE6] active:scale-[0.99] text-white font-extrabold text-[10px] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
