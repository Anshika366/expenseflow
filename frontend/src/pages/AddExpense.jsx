import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AddExpense() {
  const { addExpense, updateExpense } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const editExpenseData = location.state?.editExpense || null;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: editExpenseData?.name || "",
    amount: editExpenseData?.amount || "",
    category: editExpenseData?.category || "Food",
    date: editExpenseData?.date || new Date().toISOString().split("T")[0],
    payment_method: editExpenseData?.payment_method || editExpenseData?.paymentMethod || "UPI",
    description: editExpenseData?.description || "",
  });

  const [errors, setErrors] = useState({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryMoreOpen, setIsCategoryMoreOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const initialDateObj = formData.date ? new Date(formData.date) : new Date();
  const [calendarYear, setCalendarYear] = useState(
    isNaN(initialDateObj.getFullYear()) ? new Date().getFullYear() : initialDateObj.getFullYear()
  );
  const [calendarMonth, setCalendarMonth] = useState(
    isNaN(initialDateObj.getMonth()) ? new Date().getMonth() : initialDateObj.getMonth()
  );

  const categoryRef = useRef(null);
  const paymentRef = useRef(null);
  const dateRef = useRef(null);

  const categories = [
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
    { value: "UPI", label: "UPI", icon: "📱" },
    { value: "Cash", label: "Cash", icon: "💵" },
    { value: "Credit Card", label: "Credit Card", icon: "💳" },
    { value: "Debit Card", label: "Debit Card", icon: "💳" },
    { value: "Net Banking", label: "Net Banking", icon: "🏦" },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(event.target)) {
        setIsPaymentOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectCategory = (val) => {
    setFormData((prev) => ({ ...prev, category: val }));
    setIsCategoryOpen(false);
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleSelectPayment = (val) => {
    setFormData((prev) => ({ ...prev, payment_method: val }));
    setIsPaymentOpen(false);
    if (errors.payment_method) setErrors((prev) => ({ ...prev, payment_method: "" }));
  };

  const handleSelectDateDay = (dayNum) => {
    const formattedMonth = String(calendarMonth + 1).padStart(2, "0");
    const formattedDay = String(dayNum).padStart(2, "0");
    const newDateStr = `${calendarYear}-${formattedMonth}-${formattedDay}`;
    setFormData((prev) => ({ ...prev, date: newDateStr }));
    setIsDateOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    const formattedMonth = String(today.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(today.getDate()).padStart(2, "0");
    const newDateStr = `${today.getFullYear()}-${formattedMonth}-${formattedDay}`;
    setFormData((prev) => ({ ...prev, date: newDateStr }));
    setCalendarYear(today.getFullYear());
    setCalendarMonth(today.getMonth());
    setIsDateOpen(false);
  };

  const handleSetYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(yesterday.getDate()).padStart(2, "0");
    const newDateStr = `${yesterday.getFullYear()}-${formattedMonth}-${formattedDay}`;
    setFormData((prev) => ({ ...prev, date: newDateStr }));
    setCalendarYear(yesterday.getFullYear());
    setCalendarMonth(yesterday.getMonth());
    setIsDateOpen(false);
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Expense title is required.";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.payment_method)
      newErrors.payment_method = "Please select a payment method.";
    if (formData.description && formData.description.length > 200)
      newErrors.description = "Description cannot exceed 200 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const expensePayload = {
      ...formData,
      amount: Number(formData.amount),
    };

    if (editExpenseData && editExpenseData.id) {
      if (updateExpense) {
        await updateExpense(editExpenseData.id, expensePayload);
      }
    } else {
      if (addExpense) {
        await addExpense(expensePayload);
      }
    }
    setLoading(false);
    navigate("/dashboard");
  };

  const handleReset = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setFormData({
      name: "",
      amount: "",
      category: "Food",
      date: todayStr,
      payment_method: "UPI",
      description: "",
    });
    setErrors({});
    const d = new Date();
    setCalendarYear(d.getFullYear());
    setCalendarMonth(d.getMonth());
  };

  const selectedCategoryObj =
    categories.find((c) => c.value === formData.category) || categories[0];
  const selectedPaymentObj =
    paymentMethods.find((p) => p.value === formData.payment_method) ||
    paymentMethods[0];

  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const formattedDisplayDate = (() => {
    if (!formData.date) return "Select Date";
    const d = new Date(formData.date);
    if (isNaN(d.getTime())) return formData.date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = monthNames[d.getMonth()].slice(0, 3);
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  })();

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-6 px-4">
      <div className="max-w-xl w-full mx-auto flex items-center justify-between mb-5">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-xs font-black text-[#5B4CFF] dark:text-indigo-400 hover:underline uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white dark:bg-[#0B0F19] border border-indigo-100 dark:border-indigo-900/30 p-8 md:p-10 rounded-[32px] shadow-[0_20px_50px_-15px_rgba(91,76,255,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] text-left relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5B4CFF]/10 via-[#3B82F6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="pb-6 border-b border-slate-100 dark:border-slate-800/80 mb-6 relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5">
              <span>{editExpenseData ? "Edit Transaction" : "Log New Expense"}</span>
            </h2>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5B4CFF] dark:text-indigo-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold mt-1 uppercase tracking-wider">
            Fill in the details to debit from your balance ledger.
          </p>
        </div>

        <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Expense Title
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm"
              />
              {errors.name && (
                <p className="text-xs text-rose-500 font-bold mt-1.5">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-extrabold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm"
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5">{errors.amount}</p>
                )}
              </div>

              <div className="relative" ref={categoryRef}>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Category
                </label>
                
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{selectedCategoryObj.icon}</span>
                    <span>{selectedCategoryObj.label}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isCategoryOpen ? "rotate-180 text-[#5B4CFF]" : ""
                    }`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50 animate-in fade-in zoom-in duration-150">
                    {(isCategoryMoreOpen
                      ? categories
                      : categories.slice(0, 4).concat(
                          categories.find((c) => c.value === formData.category) &&
                            !categories.slice(0, 4).some((c) => c.value === formData.category)
                            ? [categories.find((c) => c.value === formData.category)]
                            : []
                        )
                    ).map((cat) => {
                      const isSelected = cat.value === formData.category;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            handleSelectCategory(cat.value);
                            setIsCategoryMoreOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{cat.icon}</span>
                            <span>{cat.label}</span>
                          </div>
                          {isSelected && <Check size={16} className="text-[#5B4CFF]" />}
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

                {errors.category && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative" ref={dateRef}>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Date
                </label>

                <button
                  type="button"
                  onClick={() => setIsDateOpen((prev) => !prev)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon size={18} className="text-[#5B4CFF]" />
                    <span>{formattedDisplayDate}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isDateOpen ? "rotate-180 text-[#5B4CFF]" : ""
                    }`}
                  />
                </button>

                {isDateOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-[100] w-72 text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {monthNames[calendarMonth]} {calendarYear}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {dayNames.map((d) => (
                        <span
                          key={d}
                          className="text-[11px] font-black text-slate-400 dark:text-slate-500 py-1"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-3">
                      {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="w-8 h-8" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const formattedMonthStr = String(calendarMonth + 1).padStart(2, "0");
                        const formattedDayStr = String(dayNum).padStart(2, "0");
                        const dateStr = `${calendarYear}-${formattedMonthStr}-${formattedDayStr}`;
                        const isSelected = formData.date === dateStr;

                        return (
                          <button
                            key={`day-${dayNum}`}
                            type="button"
                            onClick={() => handleSelectDateDay(dayNum)}
                            className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer mx-auto ${
                              isSelected
                                ? "bg-gradient-to-tr from-[#5B4CFF] to-[#3B82F6] text-white font-black shadow-md shadow-indigo-500/30 scale-105"
                                : "text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-[#5B4CFF]"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={handleSetYesterday}
                        className="text-[11px] font-bold text-slate-400 hover:text-[#5B4CFF] transition-colors cursor-pointer"
                      >
                        Yesterday
                      </button>
                      <button
                        type="button"
                        onClick={handleSetToday}
                        className="text-[11px] font-black text-[#5B4CFF] dark:text-indigo-400 hover:underline transition-all cursor-pointer"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={paymentRef}>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Payment Method
                </label>

                <button
                  type="button"
                  onClick={() => setIsPaymentOpen((prev) => !prev)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all shadow-sm flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{selectedPaymentObj.icon}</span>
                    <span>{selectedPaymentObj.label}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isPaymentOpen ? "rotate-180 text-[#5B4CFF]" : ""
                    }`}
                  />
                </button>

                {isPaymentOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.7)] z-50">
                    {paymentMethods.map((pm) => {
                      const isSelected = pm.value === formData.payment_method;
                      return (
                        <button
                          key={pm.value}
                          type="button"
                          onClick={() => handleSelectPayment(pm.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#F1F0FF] dark:bg-indigo-950/70 text-[#5B4CFF] dark:text-indigo-300"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{pm.icon}</span>
                            <span>{pm.label}</span>
                          </div>
                          {isSelected && <Check size={16} className="text-[#5B4CFF]" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {errors.payment_method && (
                  <p className="text-xs text-rose-500 font-bold mt-1.5">
                    {errors.payment_method}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Notes / Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Add optional notes (max 200 chars)..."
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B4CFF] focus:ring-4 focus:ring-[#5B4CFF]/10 transition-all resize-none shadow-sm"
              />
              {errors.description && (
                <p className="text-xs text-rose-500 font-bold mt-1.5">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 py-4 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] hover:from-[#4C3DE6] hover:to-[#2563EB] disabled:opacity-50 text-[#ffffff] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {loading ? "Saving..." : editExpenseData ? "Update Transaction →" : "Save Expense →"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-2xl border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
