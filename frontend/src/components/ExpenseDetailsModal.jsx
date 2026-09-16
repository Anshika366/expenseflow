import { useEffect, useRef } from "react";
import { X, Receipt, Calendar, CreditCard, Tag } from "lucide-react";

export default function ExpenseDetailsModal({ expense, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !expense) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const categoryIconMap = {
    food: { icon: "🍕", style: "bg-amber-100/90 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900/50" },
    shopping: { icon: "🛍️", style: "bg-pink-100/90 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-900/50" },
    bills: { icon: "⚡", style: "bg-amber-100/90 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900/50" },
    entertainment: { icon: "🎮", style: "bg-purple-100/90 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-900/50" },
    transport: { icon: "🚕", style: "bg-cyan-100/90 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50" },
    travel: { icon: "🚕", style: "bg-cyan-100/90 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50" },
    healthcare: { icon: "🏥", style: "bg-rose-100/90 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-900/50" },
    others: { icon: "📦", style: "bg-slate-100/90 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  };

  const getCategoryInfo = (category) => {
    const key = (category || "").toLowerCase().trim();
    return (
      categoryIconMap[key] || {
        icon: "📦",
        style: "bg-slate-100/90 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      }
    );
  };

  const catInfo = getCategoryInfo(expense.category);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden text-left z-50 space-y-6"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#5B4CFF]/15 via-[#3B82F6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900/40 shadow-sm">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Expense Details
              </h3>
              <span className="font-mono text-[11px] font-bold text-[#5B4CFF] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                {expense.id}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-100/80 dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-indigo-500/10 dark:from-rose-500/20 dark:to-indigo-500/20 border border-rose-200/50 dark:border-rose-900/30 rounded-2xl p-4.5 flex items-center justify-between relative z-10 shadow-sm">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Total Amount
            </span>
            <span className="text-2xl font-black text-rose-500 tracking-tight">
              ₹{Number(expense.amount).toLocaleString("en-IN")}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border shadow-sm ${catInfo.style}`}
          >
            <span>{catInfo.icon}</span>
            <span>{expense.category}</span>
          </span>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 p-3.5 px-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Tag size={16} className="text-[#5B4CFF]" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Title
              </span>
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {expense.name}
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 p-3.5 px-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Calendar size={16} className="text-[#5B4CFF]" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Date
              </span>
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              {expense.date}
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 p-3.5 px-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <CreditCard size={16} className="text-[#5B4CFF]" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Method
              </span>
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
              {expense.payment_method || expense.paymentMethod || "UPI"}
            </span>
          </div>

          {expense.description && (
            <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 p-3.5 px-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Notes
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {expense.description}
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 relative z-10">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
