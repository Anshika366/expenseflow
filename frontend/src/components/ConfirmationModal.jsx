import { useEffect, useRef } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Expense?",
  message = "Are you sure you want to delete this transaction? This action cannot be undone.",
  itemName,
  confirmText = "Delete",
  isDanger = true,
}) {
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

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#0B0F19] border border-indigo-100 dark:border-indigo-500/30 rounded-[32px] p-6 md:p-7 max-w-sm w-full shadow-[0_25px_60px_-10px_rgba(91,76,255,0.18)] dark:shadow-[0_25px_80px_rgba(91,76,255,0.3)] relative overflow-hidden text-center z-50 space-y-4 ring-1 ring-indigo-500/20"
      >
        <div
          className={`absolute top-0 right-0 left-0 h-28 ${
            isDanger
              ? "bg-gradient-to-b from-rose-500/15 via-purple-500/10 to-transparent"
              : "bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent"
          } pointer-events-none`}
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer z-10 border border-slate-200/60 dark:border-slate-700/60"
        >
          <X size={15} />
        </button>

        <div className="relative z-10 pt-1">
          <div
            className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-white dark:border-[#0B0F19] ${
              isDanger
                ? "bg-gradient-to-tr from-[#5B4CFF] via-purple-600 to-rose-500 text-white shadow-indigo-500/35"
                : "bg-gradient-to-tr from-[#5B4CFF] to-indigo-600 text-white shadow-indigo-500/35"
            }`}
          >
            {isDanger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
          </div>
        </div>

        <div className="relative z-10 space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {message}
          </p>

          {itemName && (
            <div className="pt-1.5">
              <span className="inline-block px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300 font-black text-xs rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
                "{itemName}"
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-1/2 py-3 ${
              isDanger
                ? "bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/30 hover:shadow-rose-500/40"
                : "bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] shadow-indigo-500/30 hover:shadow-indigo-500/40"
            } text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
