import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  History,
  Settings as SettingsIcon,
  TrendingUp,
  PieChart,
  FileText,
  LogOut,
  Crown,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      activeColor: "text-[#5B4CFF]",
      pillBg: "bg-indigo-500/10 dark:bg-indigo-500/20 text-[#5B4CFF]",
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: ReceiptIndianRupee,
      activeColor: "text-emerald-500",
      pillBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500",
    },
    {
      name: "History",
      path: "/history",
      icon: History,
      activeColor: "text-amber-500",
      pillBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-500",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: TrendingUp,
      activeColor: "text-cyan-500",
      pillBg: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500",
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: PieChart,
      activeColor: "text-purple-500",
      pillBg: "bg-purple-500/10 dark:bg-purple-500/20 text-purple-500",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      activeColor: "text-blue-500",
      pillBg: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-500",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: SettingsIcon,
      activeColor: "text-slate-600 dark:text-slate-300",
      pillBg: "bg-slate-500/10 dark:bg-slate-500/20 text-slate-500",
    },
  ];

  const mobileNavItems = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", path: "/expenses", icon: ReceiptIndianRupee },
    { name: "History", path: "/history", icon: History },
    { name: "Analytics", path: "/analytics", icon: TrendingUp },
    { name: "Budgets", path: "/budgets", icon: PieChart },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (Visible on lg screens) */}
      <aside className="hidden lg:flex w-64 shrink-0 h-auto self-stretch bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-[28px] flex-col justify-between p-6 transition-all duration-500 ease-in-out relative z-30 text-left">
        <style>{`
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          .animate-logo-float {
            animation: logoFloat 3.5s ease-in-out infinite;
          }
        `}</style>

        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#5B4CFF] to-[#2F80ED] rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-500/25 animate-logo-float">
              EF
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-[#0F172A] dark:text-white block leading-none transition-colors duration-500">
                ExpenseFlow
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mt-1">
                Smart Expense Tracker
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/expenses" && location.pathname === "/add-expense");
              return (
                <Link
                  key={`${item.path}-${index}`}
                  to={item.path}
                  className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-colors duration-150 relative overflow-hidden ${
                    isActive
                      ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300 font-extrabold"
                      : "text-[#64748B] hover:text-[#5B4CFF] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-[#5B4CFF] rounded-r-full shadow-sm" />
                  )}

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      isActive
                        ? item.pillBg
                        : "bg-slate-100/70 dark:bg-slate-900/60 text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 group-hover:text-[#5B4CFF]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-5 pb-1 mt-6">
          <div className="p-5 bg-gradient-to-br from-[#F5F3FF] via-[#FAF8FF] to-[#EFF2FE] dark:from-[#0F172A] dark:via-[#131B32] dark:to-[#0B0F19] border border-purple-200/80 dark:border-purple-800/40 rounded-2xl relative overflow-hidden text-left shadow-[0_8px_24px_-6px_rgba(124,58,237,0.12)] dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-[#5B4CFF] dark:text-indigo-400 flex items-center justify-center shadow-sm shrink-0">
                <Crown size={15} />
              </div>
              <span className="text-xs font-black text-[#5B4CFF] dark:text-indigo-300">
                Go Premium
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Unlock advanced charts, exports and smart insights.
            </p>
            <button className="w-full mt-3.5 py-2.5 px-3 bg-gradient-to-r from-[#635BFF] to-[#3B82F6] hover:from-[#544CF0] hover:to-[#2563EB] text-white text-xs font-extrabold rounded-xl shadow-[0_8px_20px_-4px_rgba(99,91,255,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(99,91,255,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer">
              Upgrade Now
            </button>
          </div>

          <Link
            to="/"
            onClick={() => localStorage.clear()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
              <LogOut size={15} />
            </div>
            <span>Logout</span>
          </Link>

          {setDarkMode && (
            <div className="flex items-center justify-center pt-1">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          )}
        </div>
      </aside>

      {/* 2. Mobile & Tablet Header Bar (Visible on < lg screens) */}
      <div className="lg:hidden w-full flex items-center justify-between bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 px-4 py-3 rounded-2xl shadow-sm mb-4 sticky top-2 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#5B4CFF] to-[#2F80ED] rounded-lg flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-500/20">
            EF
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            ExpenseFlow
          </span>
        </div>

        <div className="flex items-center gap-2">
          {setDarkMode && (
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Slide-Out Drawer Overlay (Visible when hamburger clicked on < lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-72 bg-white dark:bg-[#0B0F19] h-full p-6 flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-tr from-[#5B4CFF] to-[#2F80ED] rounded-xl flex items-center justify-center font-black text-white text-xs">
                    EF
                  </div>
                  <span className="font-black text-lg text-slate-900 dark:text-white">
                    ExpenseFlow
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === "/expenses" && location.pathname === "/add-expense");
                  return (
                    <Link
                      key={`mob-${item.path}-${index}`}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                        isActive
                          ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  localStorage.clear();
                }}
                className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Navigation Bar (Fixed at bottom on < lg screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-2 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/expenses" && location.pathname === "/add-expense");
          return (
            <Link
              key={`bottom-${item.path}`}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? "text-[#5B4CFF] dark:text-indigo-400 scale-105"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
