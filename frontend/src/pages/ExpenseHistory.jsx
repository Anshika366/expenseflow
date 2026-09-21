import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Check,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import ExpenseDetailsModal from "../components/ExpenseDetailsModal";
import ConfirmationModal from "../components/ConfirmationModal";
import CustomDatePicker from "../components/CustomDatePicker";

export default function ExpenseHistory() {
  const { state, deleteExpense } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryMoreOpen, setIsCategoryMoreOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const categoryRef = useRef(null);
  const paymentRef = useRef(null);
  const sortRef = useRef(null);

  const categories = [
    { value: "All", label: "All Categories", icon: "📦" },
    { value: "Food", label: "Food", icon: "🍕" },
    { value: "Shopping", label: "Shopping", icon: "🛍️" },
    { value: "Travel", label: "Travel", icon: "✈️" },
    { value: "Bills", label: "Bills", icon: "⚡" },
    { value: "Education", label: "Education", icon: "🎓" },
    { value: "Entertainment", label: "Entertainment", icon: "🎮" },
    { value: "Healthcare", label: "Healthcare", icon: "🏥" },
    { value: "Fuel", label: "Fuel", icon: "⛽" },
    { value: "Rent", label: "Rent", icon: "🏠" },
    { value: "Transport", label: "Transport", icon: "🚕" },
    { value: "Others", label: "Others", icon: "📦" },
  ];

  const paymentMethods = [
    { value: "All", label: "All Methods", icon: "💳" },
    { value: "UPI", label: "UPI", icon: "📱" },
    { value: "Cash", label: "Cash", icon: "💵" },
    { value: "Credit Card", label: "Credit Card", icon: "💳" },
    { value: "Debit Card", label: "Debit Card", icon: "💳" },
    { value: "Net Banking", label: "Net Banking", icon: "🏦" },
  ];

  const sortOptions = [
    { value: "date", label: "Sort by Date", icon: "📅" },
    { value: "amount", label: "Sort by Amount", icon: "💵" },
    { value: "name", label: "Sort by Title", icon: "🔤" },
  ];

  const categoryIconMap = {
    food: { icon: "🍕", style: "bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40" },
    shopping: { icon: "🛍️", style: "bg-pink-100/80 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200/60 dark:border-pink-900/40" },
    bills: { icon: "⚡", style: "bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40" },
    education: { icon: "🎓", style: "bg-blue-100/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40" },
    entertainment: { icon: "🎮", style: "bg-purple-100/80 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-900/40" },
    transport: { icon: "🚕", style: "bg-cyan-100/80 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-900/40" },
    travel: { icon: "✈️", style: "bg-cyan-100/80 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-900/40" },
    healthcare: { icon: "🏥", style: "bg-rose-100/80 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40" },
    fuel: { icon: "⛽", style: "bg-orange-100/80 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200/60 dark:border-orange-900/40" },
    rent: { icon: "🏠", style: "bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/40" },
    others: { icon: "📦", style: "bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60 dark:border-slate-700" },
  };

  const getCategoryDetails = (category) => {
    const key = (category || "").toLowerCase().trim();
    return (
      categoryIconMap[key] || {
        icon: "📦",
        style: "bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60 dark:border-slate-700",
      }
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(event.target)) {
        setIsPaymentOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredExpenses = (state.expenses || []).filter((exp) => {
    const query = searchTerm.toLowerCase();
    const expId = String(exp.id || "").toLowerCase();
    const expName = String(exp.name || "").toLowerCase();
    const expCategory = String(exp.category || "").toLowerCase();
    const expPayment = String(exp.payment_method || exp.paymentMethod || "").toLowerCase();

    const matchesSearch =
      expName.includes(query) ||
      expCategory.includes(query) ||
      expPayment.includes(query) ||
      expId.includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      (exp.category || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchesPayment =
      selectedPayment === "All" ||
      expPayment.toLowerCase() === selectedPayment.toLowerCase();

    const matchesDate =
      !selectedDate ||
      (exp.date && exp.date.startsWith(selectedDate));

    const expAmt = Number(exp.amount) || 0;
    const matchesMinAmount = !minAmount || expAmt >= Number(minAmount);
    const matchesMaxAmount = !maxAmount || expAmt <= Number(maxAmount);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPayment &&
      matchesDate &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let valA = a[sortBy] ?? "";
    let valB = b[sortBy] ?? "";

    if (sortBy === "amount") {
      valA = Number(a.amount) || 0;
      valB = Number(b.amount) || 0;
    } else if (sortBy === "date") {
      valA = new Date(a.date).getTime() || 0;
      valB = new Date(b.date).getTime() || 0;
    } else if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleHeaderClick = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ArrowUp size={14} className="text-[#5B4CFF] inline ml-1" />
    ) : (
      <ArrowDown size={14} className="text-[#5B4CFF] inline ml-1" />
    );
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleEdit = (expense) => {
    navigate("/add-expense", { state: { editExpense: expense } });
  };

  const handleDelete = (expenseId) => {
    const target = (state.expenses || []).find((e) => e.id === expenseId);
    setDeleteTarget(target || { id: expenseId, name: "Expense" });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget && deleteExpense) {
      await deleteExpense(deleteTarget.id);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const selectedCategoryObj =
    categories.find((c) => c.value === selectedCategory) || categories[0];
  const selectedSortObj =
    sortOptions.find((s) => s.value === sortBy) || sortOptions[0];

  return (
    <div className="space-y-6 text-left pb-12 font-sans pr-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-[#5B4CFF] dark:text-slate-400 dark:hover:text-indigo-400 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Transaction History
            </h1>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-300 text-xs font-black rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
              {sortedExpenses.length} Entries
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-4 md:p-5 rounded-[24px] shadow-sm">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="md:col-span-4 relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all"
              />
            </div>

            <div className="md:col-span-3 relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm">{selectedCategoryObj.icon}</span>
                  <span className="truncate">{selectedCategoryObj.label}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    isCategoryOpen ? "rotate-180 text-[#5B4CFF]" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50 animate-in fade-in zoom-in duration-150">
                  {(isCategoryMoreOpen
                    ? categories
                    : categories.slice(0, 5).concat(
                        categories.find((c) => c.value === selectedCategory) &&
                          !categories.slice(0, 5).some((c) => c.value === selectedCategory)
                          ? [categories.find((c) => c.value === selectedCategory)]
                          : []
                      )
                  ).map((cat) => {
                    const isSelected = cat.value === selectedCategory;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setIsCategoryOpen(false);
                          setIsCategoryMoreOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </div>
                        {isSelected && <Check size={16} className="text-[#5B4CFF] shrink-0" />}
                      </button>
                    );
                  })}

                  {!isCategoryMoreOpen ? (
                    <button
                      type="button"
                      onClick={() => setIsCategoryMoreOpen(true)}
                      className="w-full px-3.5 py-2 rounded-xl text-[11px] font-black text-[#5B4CFF] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 flex items-center justify-center gap-1.5 border border-dashed border-indigo-200 dark:border-indigo-800/60 mt-1 cursor-pointer transition-all"
                    >
                      <span>More Categories...</span>
                      <ChevronDown size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCategoryMoreOpen(false)}
                      className="w-full px-3.5 py-2 rounded-xl text-[11px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 mt-1 cursor-pointer transition-all border-t border-slate-100 dark:border-slate-800"
                    >
                      <span>Show Less</span>
                      <ChevronUp size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-3 relative" ref={paymentRef}>
              <button
                type="button"
                onClick={() => setIsPaymentOpen((prev) => !prev)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-sm">
                    {paymentMethods.find((p) => p.value === selectedPayment)?.icon || "💳"}
                  </span>
                  <span className="truncate">
                    {paymentMethods.find((p) => p.value === selectedPayment)?.label || "All Methods"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    isPaymentOpen ? "rotate-180 text-[#5B4CFF]" : ""
                  }`}
                />
              </button>

              {isPaymentOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50">
                  {paymentMethods.map((pm) => {
                    const isSelected = pm.value === selectedPayment;
                    return (
                      <button
                        key={pm.value}
                        type="button"
                        onClick={() => {
                          setSelectedPayment(pm.value);
                          setIsPaymentOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base">{pm.icon}</span>
                          <span>{pm.label}</span>
                        </div>
                        {isSelected && <Check size={16} className="text-[#5B4CFF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="md:col-span-2 relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs">{selectedSortObj.icon}</span>
                  <span className="truncate">{selectedSortObj.label}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    isSortOpen ? "rotate-180 text-[#5B4CFF]" : ""
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50">
                  {sortOptions.map((opt) => {
                    const isSelected = opt.value === sortBy;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{opt.icon}</span>
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-[#5B4CFF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Date:</span>
              <CustomDatePicker
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Amount:</span>
              <input
                type="number"
                placeholder="Min ₹"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#5B4CFF]"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#5B4CFF]"
              />
            </div>

            {(searchTerm || selectedCategory !== "All" || selectedPayment !== "All" || selectedDate || minAmount || maxAmount) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedPayment("All");
                  setSelectedDate("");
                  setMinAmount("");
                  setMaxAmount("");
                }}
                className="ml-auto text-xs font-black text-rose-500 hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 rounded-[28px] shadow-sm overflow-hidden">
        {sortedExpenses.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B4CFF] flex items-center justify-center mx-auto mb-3 text-xl">
              🔍
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-extrabold">
              No transactions match your search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-black uppercase tracking-wider text-[#0F172A] dark:text-white bg-slate-50/80 dark:bg-slate-900/60">
                  <th className="py-4 px-5">
                    ID
                  </th>
                  <th
                    onClick={() => handleHeaderClick("name")}
                    className="py-4 px-5 cursor-pointer hover:text-[#5B4CFF] dark:hover:text-indigo-400 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Title</span>
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderClick("category")}
                    className="py-4 px-5 cursor-pointer hover:text-[#5B4CFF] dark:hover:text-indigo-400 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Category</span>
                      {renderSortIcon("category")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleHeaderClick("date")}
                    className="py-4 px-5 cursor-pointer hover:text-[#5B4CFF] dark:hover:text-indigo-400 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      {renderSortIcon("date")}
                    </div>
                  </th>
                  <th className="py-4 px-5">
                    Method
                  </th>
                  <th
                    onClick={() => handleHeaderClick("amount")}
                    className="py-4 px-5 cursor-pointer hover:text-[#5B4CFF] dark:hover:text-indigo-400 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Amount</span>
                      {renderSortIcon("amount")}
                    </div>
                  </th>
                  <th className="py-4 px-5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold">
                {sortedExpenses.map((expense) => {
                  const catInfo = getCategoryDetails(expense.category);
                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-5 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {expense.id}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white">
                        {expense.name}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black rounded-xl border ${catInfo.style}`}
                        >
                          <span>{catInfo.icon}</span>
                          <span>{expense.category}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-500 dark:text-slate-400">
                        {expense.date}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-600 dark:text-slate-300">
                        {expense.payment_method || expense.paymentMethod || "UPI"}
                      </td>
                      <td className="py-4 px-5 font-black text-rose-500 text-sm">
                        ₹{Number(expense.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(expense)}
                            className="w-8 h-8 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/30 text-[#5B4CFF] dark:text-indigo-400 hover:bg-[#5B4CFF] hover:text-white hover:border-[#5B4CFF] hover:shadow-md hover:shadow-indigo-500/30 hover:scale-110 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleEdit(expense)}
                            className="w-8 h-8 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100/60 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/30 hover:scale-110 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="w-8 h-8 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100/60 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/30 hover:scale-110 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExpenseDetailsModal
        expense={selectedExpense}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense?"
        message="Are you sure you want to delete this expense transaction? This action cannot be undone."
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.id})` : ""}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
}
