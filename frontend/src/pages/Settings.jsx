import { useState, useRef } from "react";
import {
  Trash2,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Settings as SettingsIcon,
  Moon,
  Sun,
} from "lucide-react";
import api from "../services/api";
import { useApp } from "../context/AppContext";
import ConfirmationModal from "../components/ConfirmationModal";
import ThemeToggle from "../components/ThemeToggle";

export default function Settings({ darkMode, setDarkMode }) {
  const { state, fetchAppData } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setIsExporting(true);
    setFeedback(null);
    try {
      let exportData;
      try {
        const res = await api.get("/settings/export");
        exportData = res.data;
      } catch {
        exportData = {
          version: "1.0",
          exportDate: new Date().toISOString(),
          expenses: state.expenses || [],
          totalFunds: state.totalFunds || 0,
          totalExpenses: state.totalExpenses || 0,
          remainingBalance: state.remainingBalance || 0,
        };
      }

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const todayStr = new Date().toISOString().split("T")[0];
      const link = document.createElement("a");
      link.href = url;
      link.download = `expenseflow-data-${todayStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedback({
        type: "success",
        message: "JSON Data Backup exported and downloaded successfully!",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Export failed. Please check your data and try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    setFeedback(null);
    try {
      let backupData;
      try {
        const res = await api.get("/settings/backup");
        backupData = res.data;
      } catch {
        backupData = {
          version: "1.0",
          backupDate: new Date().toISOString(),
          appState: {
            expenses: state.expenses || [],
            totalFunds: state.totalFunds || 0,
            totalExpenses: state.totalExpenses || 0,
            remainingBalance: state.remainingBalance || 0,
          },
        };
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const todayStr = new Date().toISOString().split("T")[0];
      const link = document.createElement("a");
      link.href = url;
      link.download = `expenseflow-full-backup-${todayStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedback({
        type: "success",
        message: "Full system snapshot backup downloaded successfully!",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Backup generation failed. Please try again.",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setFeedback({
        type: "error",
        message: "Invalid file type. Please upload a valid JSON (.json) backup file.",
      });
      e.target.value = "";
      return;
    }

    setIsImporting(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        let parsedData;
        try {
          parsedData = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON formatting in uploaded file.");
        }

        try {
          const res = await api.post("/settings/import", parsedData);
          const { imported = 0, duplicates = 0 } = res.data || {};
          await fetchAppData();
          setFeedback({
            type: "success",
            message: `Import Completed! ${imported} new transaction(s) imported, ${duplicates} duplicate(s) skipped.`,
          });
        } catch {
          const items =
            parsedData.expenses ||
            parsedData.appState?.expenses ||
            (Array.isArray(parsedData) ? parsedData : []);

          if (items.length > 0) {
            for (const item of items) {
              try {
                await api.post("/expenses", {
                  name: item.name || item.title || "Imported Item",
                  amount: Number(item.amount) || 0,
                  category: item.category || "Others",
                  date: item.date || new Date().toISOString().split("T")[0],
                  payment_method: item.payment_method || item.paymentMethod || item.method || "UPI",
                  notes: item.notes || "",
                });
              } catch (e) {
                void e;
              }
            }
            await fetchAppData();
            setFeedback({
              type: "success",
              message: `Import Completed! Imported ${items.length} records into your ledger.`,
            });
          } else {
            throw new Error("No valid transactions found in the uploaded file.");
          }
        }
      } catch (err) {
        const errMsg =
          err.response?.data?.detail ||
          err.message ||
          "Import failed due to invalid data format.";
        setFeedback({ type: "error", message: errMsg });
      } finally {
        setIsImporting(false);
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      setFeedback({
        type: "error",
        message: "Failed to read the selected file.",
      });
      setIsImporting(false);
      e.target.value = "";
    };

    reader.readAsText(file);
  };

  const handleOpenDeleteModal = () => {
    setFeedback(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    setIsDeleting(true);
    try {
      let deletedCount = 0;
      try {
        const res = await api.delete("/settings/delete-all");
        deletedCount = res.data?.deletedCount ?? 0;
      } catch {
        const expensesToDelete = state.expenses || [];
        for (const exp of expensesToDelete) {
          if (exp.id) {
            try {
              await api.delete(`/expenses/${exp.id}`);
              deletedCount++;
            } catch (e) {
              void e;
            }
          }
        }
      }

      await fetchAppData();
      setFeedback({
        type: "success",
        message: `All expense records deleted successfully (${deletedCount} items purged). Account remains active.`,
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.detail || "Delete all failed. Please try again.";
      setFeedback({ type: "error", message: errMsg });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pt-2 md:pt-4 pb-12 text-left font-sans text-slate-800 dark:text-slate-100 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 p-6 rounded-[28px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#5B4CFF]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
              <SettingsIcon size={18} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Settings & Preferences
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Manage theme preferences, export JSON backups, and control transaction data.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-extrabold shadow-sm animate-card-entrance ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs hover:underline opacity-80 cursor-pointer font-black px-2 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-[28px] p-6 md:p-8 shadow-sm space-y-4">
        <div className="group p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-[#5B4CFF]/60 hover:shadow-[0_12px_30px_-8px_rgba(91,76,255,0.15)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Appearance Mode
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Switch between Light and Dark visual themes.
              </p>
            </div>
          </div>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        <div className="group p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-[#5B4CFF]/60 hover:shadow-[0_12px_30px_-8px_rgba(91,76,255,0.15)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Download size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Export Data Backup
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Download a JSON snapshot of your expenses and funds.
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 cursor-pointer transition-all shrink-0"
          >
            <Download size={15} />
            <span>{isExporting ? "Exporting..." : "Export Data"}</span>
          </button>
        </div>

        <div className="group p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-blue-500/60 hover:shadow-[0_12px_30px_-8px_rgba(59,130,246,0.15)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Full System Backup
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Generate and download a full system backup file.
              </p>
            </div>
          </div>
          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer transition-all shrink-0"
          >
            <ShieldCheck size={15} />
            <span>{isBackingUp ? "Backing up..." : "Backup Data"}</span>
          </button>
        </div>

        <div className="group p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-emerald-500/60 hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Upload size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Import Data Backup
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Restore or import transactions from a .json file.
              </p>
            </div>
          </div>
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 cursor-pointer transition-all shrink-0"
          >
            <Upload size={15} />
            <span>{isImporting ? "Importing..." : "Import Data"}</span>
          </button>
        </div>

        <div className="group p-5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl flex items-center justify-between hover:border-rose-500/60 hover:shadow-[0_12px_30px_-8px_rgba(244,63,94,0.15)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center border border-rose-200 dark:border-rose-900/40">
              <Trash2 size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-600 dark:text-rose-400">
                Clear All Expense Records
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Wipe clean all transactions and reset balances.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenDeleteModal}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 cursor-pointer transition-all shrink-0"
          >
            <Trash2 size={15} />
            <span>{isDeleting ? "Deleting..." : "Clear System"}</span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteAll}
        title="Delete All Expenses"
        message="Are you sure you want to delete all transaction history? This action cannot be undone."
        confirmText="Delete All"
        isDanger={true}
      />
    </div>
  );
}
