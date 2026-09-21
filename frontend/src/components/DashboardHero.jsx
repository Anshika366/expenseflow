import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import heroWallet3D from "../assets/hero_wallet_3d.png";

export default function DashboardHero({
  userName = "Anshika",
  timeFilter = "This Month",
  setTimeFilter,
  timeFilterOptions = [
    "Today",
    "Last 7 Days",
    "Last 15 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Range",
  ],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#0B0F19] border border-purple-200/60 dark:border-purple-900/50 hover:border-[#8B5CF6]/80 dark:hover:border-[#A855F7]/80 px-6 md:px-8 py-6 md:py-7 rounded-[28px] shadow-[0_15px_40px_-15px_rgba(139,92,246,0.16)] dark:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.28)] hover:shadow-[0_20px_50px_-10px_rgba(139,92,246,0.28)] dark:hover:shadow-[0_25px_60px_-10px_rgba(168,85,247,0.4)] flex items-center justify-start gap-3 md:gap-4 min-h-[175px] relative z-20 animate-card-entrance transition-all duration-500 text-left group">

      <div className="z-10 py-1 max-w-sm shrink-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2.5 whitespace-nowrap transition-colors duration-500">
          Welcome back, {userName}! <span className="animate-wave-hand inline-block transform origin-bottom-right">👋</span>
        </h2>
        <p className="text-xs md:text-sm text-[#64748B] dark:text-slate-400 font-medium mt-1.5 leading-relaxed transition-colors duration-500">
          Here's your real-time financial overview and insights.
        </p>
      </div>

      <div className="hidden md:flex items-center justify-center z-10 shrink-0 ml-1 md:ml-3">
        <div className="w-64 md:w-72 h-32 md:h-36 relative animate-float-wallet flex items-center justify-center">
          <span className="absolute -top-3 left-[15%] text-[8px] text-[#A855F7] dark:text-purple-300 opacity-80 animate-pulse pointer-events-none select-none z-20" style={{ animationDelay: '0s' }}>✦</span>
          <span className="absolute -top-5 right-[20%] text-[12px] text-[#C084FC] dark:text-purple-400 opacity-90 animate-pulse pointer-events-none select-none z-20" style={{ animationDelay: '0.8s' }}>✦</span>
          <span className="absolute top-[36%] -right-3 text-[7px] text-[#8B5CF6] dark:text-purple-300 opacity-75 animate-pulse pointer-events-none select-none z-20" style={{ animationDelay: '1.5s' }}>✦</span>
          <span className="absolute -bottom-3 left-[8%] text-[10px] text-[#9333EA] dark:text-purple-400 opacity-85 animate-pulse pointer-events-none select-none z-20" style={{ animationDelay: '2.2s' }}>✦</span>

          <img
            src={heroWallet3D}
            alt="ExpenseFlow Wallet"
            className="w-full h-full object-contain pointer-events-none scale-125 relative z-10 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="absolute top-6 right-6 z-50" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F3FF] dark:bg-slate-900 border border-purple-200/60 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:border-[#635BFF] shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <span>{timeFilter}</span>
          <ChevronDown size={13} className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-[175px] bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/80 shadow-[0_20px_50px_-10px_rgba(99,91,255,0.22)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-[22px] p-2 z-[99999] transition-all duration-200 ease-out text-left space-y-1">
            {timeFilterOptions.map((opt) => {
              const isSelected = timeFilter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (setTimeFilter) setTimeFilter(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-[14px] text-xs font-extrabold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#EEF2FF] text-[#635BFF] dark:bg-purple-950/60 dark:text-purple-300"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <span className="text-xs font-black text-[#635BFF] dark:text-purple-300">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
