import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Wallet,
  CreditCard,
  Receipt,
  AlertTriangle,
  Zap,
  Activity,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import DashboardHero from "../components/DashboardHero";
import DashboardKPICards from "../components/DashboardKPICards";

export default function Dashboard({ darkMode }) {
  const { state, addFunds } = useApp();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState("");
  const [, setValidationError] = useState("");
  const [, setCurrentTime] = useState("");

  const [timeFilter, setTimeFilter] = useState("Today");
  const [isCard2DropdownOpen, setIsCard2DropdownOpen] = useState(false);
  const card2DropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideCard2 = (event) => {
      if (card2DropdownRef.current && !card2DropdownRef.current.contains(event.target)) {
        setIsCard2DropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCard2);
    return () => document.removeEventListener("mousedown", handleClickOutsideCard2);
  }, []);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [appliedCustomRange, setAppliedCustomRange] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [addFundsInput, setAddFundsInput] = useState("");

  const triggerRef = useRef(null);
  const portalRef = useRef(null);
  const searchRef = useRef(null);

  const user = state.user || {};
  const userName = user.name || "Anshika";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (customStartDate && customEndDate) {
      setAppliedCustomRange({ start: customStartDate, end: customEndDate });
    }
  };

  const handleAddFundsSubmit = (e) => {
    e.preventDefault();
    const val = Number(addFundsInput);
    if (val > 0) {
      addFunds(val);
      setAddFundsInput("");
      setIsAddFundsModalOpen(false);
    }
  };

  const getCategoryIcon = (cat) => {
    const catLower = (cat || "").toLowerCase();
    if (catLower.includes("food")) return "🍔";
    if (catLower.includes("shop")) return "🛍️";
    if (catLower.includes("bill") || catLower.includes("#5B4CFF") || catLower.includes("electric")) return "⚡";
    if (catLower.includes("rent") || catLower.includes("home")) return "🏠";
    if (catLower.includes("travel") || catLower.includes("transport") || catLower.includes("cab")) return "🚕";
    if (catLower.includes("health") || catLower.includes("med")) return "🏥";
    if (catLower.includes("edu")) return "🎓";
    if (catLower.includes("enter") || catLower.includes("movie")) return "🎮";
    return "📦";
  };

  const timeFilterOptions = [
    "Today",
    "Last 7 Days",
    "Last 15 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Range",
  ];

  const getFilteredExpenses = () => {
    const expenses = state.expenses || [];
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return expenses.filter((item) => {
      if (!item.date) return false;
      const itemDateStr = item.date.split("T")[0];
      const itemDate = new Date(itemDateStr);

      switch (timeFilter) {
        case "Today":
          return itemDateStr === todayStr;

        case "Last 7 Days": {
          const past = new Date(now);
          past.setDate(now.getDate() - 7);
          return itemDate >= past && itemDateStr < todayStr;
        }

        case "Last 15 Days": {
          const past = new Date(now);
          past.setDate(now.getDate() - 15);
          return itemDate >= past && itemDateStr < todayStr;
        }

        case "Last 30 Days": {
          const past = new Date(now);
          past.setDate(now.getDate() - 30);
          return itemDate >= past && itemDateStr < todayStr;
        }

        case "This Month": {
          return (
            itemDate.getFullYear() === now.getFullYear() &&
            itemDate.getMonth() === now.getMonth()
          );
        }

        case "Last Month":
        case "Previous Month": {
          const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            itemDate.getFullYear() === prevMonthDate.getFullYear() &&
            itemDate.getMonth() === prevMonthDate.getMonth()
          );
        }

        case "Custom Range": {
          if (!appliedCustomRange?.start || !appliedCustomRange?.end) return true;
          return (
            itemDateStr >= appliedCustomRange.start &&
            itemDateStr <= appliedCustomRange.end
          );
        }

        default:
          return true;
      }
    });
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const expenses = state.expenses || [];

    return expenses.filter((exp, idx) => {
      const expId = String(exp.id || `EXP-${String(idx + 1).padStart(4, "0")}`).toLowerCase();
      const expName = String(exp.name || "").toLowerCase();
      const expCat = String(exp.category || "").toLowerCase();
      const expPay = String(exp.payment_method || exp.paymentMethod || "Card").toLowerCase();

      return (
        expName.includes(query) ||
        expCat.includes(query) ||
        expPay.includes(query) ||
        expId.includes(query)
      );
    });
  };

  const searchResults = getSearchResults();

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = (queryText) => {
    setIsSearchOpen(false);
    navigate(`/history?search=${encodeURIComponent(queryText)}`);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalFilteredExpenses = filteredExpenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );
  const remainingBalanceFiltered = (state.totalFunds ?? 0) - totalFilteredExpenses;
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySpendingFiltered = filteredExpenses
    .filter((e) => e.date?.split("T")[0] === todayStr)
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalTransactionsFiltered = filteredExpenses.length;

  const calculateCategoryDistribution = () => {
    if (filteredExpenses.length === 0) return [];

    const totals = {};
    let grandTotal = 0;

    filteredExpenses.forEach((item) => {
      const cat = item.category || "Others";
      const amt = Number(item.amount) || 0;
      totals[cat] = (totals[cat] || 0) + amt;
      grandTotal += amt;
    });

    if (grandTotal === 0) return [];

    const palette = ["#5B4CFF", "#EC4899", "#F59E0B", "#2F80ED", "#8B5CF6", "#10B981", "#EF4444"];

    return Object.keys(totals).map((catName, idx) => {
      const val = totals[catName];
      const pct = Math.round((val / grandTotal) * 100);
      return {
        name: catName,
        value: val,
        percentage: pct,
        color: palette[idx % palette.length],
        icon: getCategoryIcon(catName),
      };
    });
  };

  const categoryDistribution = calculateCategoryDistribution();

  const getSmoothCurvePath = (points) => {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

    let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const calculateSparklineData = (type) => {
    const expenses = state.expenses || [];
    const funds = state.totalFunds || 0;

    const defaultCurves = {
      funds: [{ val: 12 }, { val: 15 }, { val: 14 }, { val: 18 }, { val: 16 }, { val: 21 }, { val: 24 }],
      expenses: [{ val: 6 }, { val: 11 }, { val: 22 }, { val: 13 }, { val: 26 }, { val: 14 }, { val: 18 }],
      balance: [{ val: 22 }, { val: 20 }, { val: 18 }, { val: 19 }, { val: 17 }, { val: 16 }, { val: 16 }],
      today: [{ val: 5 }, { val: 9 }, { val: 18 }, { val: 12 }, { val: 21 }, { val: 11 }, { val: 15 }],
      transactions: [{ val: 6 }, { val: 9 }, { val: 12 }, { val: 15 }, { val: 17 }, { val: 20 }, { val: 22 }],
    };

    if (!expenses || expenses.length === 0) {
      return defaultCurves[type] || defaultCurves.funds;
    }

    const points = expenses.slice(-7).map((e, idx) => {
      const amt = Number(e.amount) || 0;
      if (type === "funds") return { val: funds + (idx + 1) * 150 + Math.sin(idx) * 80 };
      if (type === "expenses") return { val: amt + (idx % 2 === 0 ? 50 : 20) };
      if (type === "balance") return { val: Math.max(10, funds - amt * (idx + 1) + Math.cos(idx) * 40) };
      if (type === "today") return { val: idx % 2 === 0 ? amt + 40 : amt * 0.5 + 20 };
      return { val: (idx + 1) * 3 + (idx % 2 === 0 ? 2 : 5) };
    });

    return points.length < 3 ? (defaultCurves[type] || defaultCurves.funds) : points;
  };

  const renderSparkline = (type, color = "#10B981", gradientId = "sparkGrad") => {
    const data = calculateSparklineData(type);
    const vals = data.map((d) => d.val);
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);

    let range = maxVal - minVal;
    if (range === 0) range = 1;

    const coords = data.map((d, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = 18 - ((d.val - minVal) / range) * 13;
      return { x, y };
    });

    const curveD = getSmoothCurvePath(coords);
    const fillD = `${curveD} L 100 20 L 0 20 Z`;
    const lastPoint = coords[coords.length - 1];

    return (
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gradientId})`} />
        <path
          d={curveD}
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {lastPoint && (
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="2.5"
            fill={color}
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  const fundsIllustration = (
    <svg className="w-[32px] h-[32px] overflow-visible" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="fundsGrad" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="fundsCoinGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <filter id="fundsShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#047857" floodOpacity="0.3" />
        </filter>
      </defs>
      <g transform="translate(6, 12)" filter="url(#fundsShadow)">
        <rect width="34" height="24" rx="7" fill="url(#fundsGrad)" />
        <circle cx="27" cy="12" r="3.5" fill="#A7F3D0" />
        <circle cx="27" cy="12" r="1.5" fill="#047857" />
      </g>
      <g transform="translate(24, 4)">
        <circle cx="9" cy="9" r="9" fill="url(#fundsCoinGrad)" stroke="#F59E0B" strokeWidth="0.7" />
        <circle cx="9" cy="9" r="6.5" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
        <text x="9" y="12.5" fill="#92400E" fontSize="9" fontWeight="bold" textAnchor="middle">₹</text>
      </g>
    </svg>
  );

  const expIllustration = (
    <svg className="w-[32px] h-[32px] overflow-visible" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="expPaperGrad" x1="0" y1="0" x2="28" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE4E6" />
        </linearGradient>
        <linearGradient id="expCardGrad" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#EF476F" />
        </linearGradient>
        <filter id="expShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#EF476F" floodOpacity="0.25" />
        </filter>
      </defs>
      <g transform="translate(8, 6)" filter="url(#expShadow)">
        <path d="M0 4 C0 1.8 1.8 0 4 0 H24 C26.2 0 28 1.8 28 4 V32 L24 30 L20 32 L16 30 L12 32 L8 30 L4 32 L0 30 Z" fill="url(#expPaperGrad)" stroke="#FECDD3" strokeWidth="0.8" />
        <rect x="5" y="6" width="18" height="2.5" rx="1" fill="#FDA4AF" opacity="0.7" />
        <rect x="5" y="11.5" width="14" height="2" rx="1" fill="#FDA4AF" opacity="0.5" />
        <rect x="5" y="16" width="18" height="2" rx="1" fill="#FDA4AF" opacity="0.5" />
      </g>
      <g transform="translate(18, 20)">
        <rect width="24" height="15" rx="4" fill="url(#expCardGrad)" />
        <text x="12" y="11" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">₹</text>
      </g>
    </svg>
  );

  const balIllustration = (
    <svg className="w-[32px] h-[32px] overflow-visible" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="balShieldGrad" x1="0" y1="0" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="balBadgeGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D1FAE5" />
        </linearGradient>
        <filter id="balShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#10B981" floodOpacity="0.3" />
        </filter>
      </defs>
      <g transform="translate(9, 6)" filter="url(#balShadow)">
        <path d="M15 0 L28 5 V15 C28 23.5 22.5 30 15 33 C7.5 30 2 23.5 2 15 V5 Z" fill="url(#balShieldGrad)" stroke="#A7F3D0" strokeWidth="0.8" />
        <circle cx="15" cy="15" r="7.5" fill="url(#balBadgeGrad)" />
        <path d="M11.5 15 L14 17.5 L19 12.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );

  const todayIllustration = (
    <svg className="w-[32px] h-[32px] overflow-visible" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="todayCalHeader" x1="0" y1="0" x2="28" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="todayCoinGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="todayShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#1D4ED8" floodOpacity="0.25" />
        </filter>
      </defs>
      <g transform="translate(8, 8)" filter="url(#todayShadow)">
        <rect width="28" height="28" rx="6" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="0.8" />
        <path d="M0 6 C0 2.7 2.7 0 6 0 H22 C25.3 0 28 2.7 28 6 V9 H0 Z" fill="url(#todayCalHeader)" />
        <rect x="7" y="-2" width="2" height="4" rx="1" fill="#FFFFFF" />
        <rect x="19" y="-2" width="2" height="4" rx="1" fill="#FFFFFF" />
        <circle cx="8" cy="16" r="1.5" fill="#93C5FD" />
        <circle cx="14" cy="16" r="1.5" fill="#93C5FD" />
        <circle cx="20" cy="16" r="1.5" fill="#93C5FD" />
        <circle cx="8" cy="22" r="1.5" fill="#93C5FD" />
        <circle cx="14" cy="22" r="2" fill="#2563EB" />
      </g>
      <g transform="translate(24, 20)">
        <circle cx="9" cy="9" r="8" fill="url(#todayCoinGrad)" stroke="#60A5FA" strokeWidth="0.7" />
        <text x="9" y="12.5" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">₹</text>
      </g>
    </svg>
  );

  const txIllustration = (
    <svg className="w-[32px] h-[32px] overflow-visible" viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="txBill1" x1="0" y1="0" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="txBill2" x1="0" y1="0" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#6B21A8" />
        </linearGradient>
        <filter id="txShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#6B21A8" floodOpacity="0.3" />
        </filter>
      </defs>
      <g transform="translate(6, 16)" filter="url(#txShadow)">
        <rect width="28" height="17" rx="4.5" fill="url(#txBill1)" transform="rotate(-6 14 8.5)" opacity="0.7" />
        <rect width="28" height="17" rx="4.5" fill="url(#txBill2)" transform="translate(3, -4)" />
        <circle cx="17" cy="4.5" r="3.5" fill="#F3E8FF" />
        <text x="17" y="7.5" fill="#6B21A8" fontSize="7" fontWeight="bold" textAnchor="middle">₹</text>
      </g>
      <g transform="translate(24, 4)">
        <circle cx="9" cy="9" r="8.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
        <path d="M9 4 L11 8.5 H8.5 L10 13.5 L6.5 9 H9.5 Z" fill="#D97706" />
      </g>
    </svg>
  );

  return (
    <div className="w-full space-y-5 relative transition-all duration-500 ease-in-out font-sans text-slate-800 dark:text-slate-100 pr-2">
      <style>{`
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(8px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-card-entrance {
          animation: cardEntrance 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes waveHand {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(14deg); }
          40% { transform: rotate(-8deg); }
          60% { transform: rotate(14deg); }
          80% { transform: rotate(-4deg); }
        }
        .animate-wave-hand {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: waveHand 2s ease-in-out infinite;
        }
        @keyframes floatLevitate {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-wallet {
          animation: floatLevitate 4s ease-in-out infinite;
        }
      `}</style>



      <div className="flex items-center justify-between gap-4 bg-white/95 dark:bg-[#0B0F19]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 rounded-full shadow-sm transition-all duration-500 relative z-30">
        <div className="w-full md:w-[440px] relative group" ref={searchRef}>
          <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-[#5B4CFF] transition-colors" />
          <input
            type="text"
            placeholder="Search expenses, categories or transaction ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full text-xs bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-full pl-10 pr-10 py-2 focus:outline-none focus:border-[#5B4CFF] focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center justify-center relative text-slate-600 dark:text-slate-300 text-xs hover:border-[#5B4CFF] transition-all duration-200 cursor-pointer"
          >
            <Bell size={16} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#5B4CFF] rounded-full text-[8px] font-extrabold text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
              3
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5B4CFF] to-[#2F80ED] text-white flex items-center justify-center text-xs font-black shadow-md shadow-indigo-500/20">
              A
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline-block">
              {userName}
            </span>
          </div>
        </div>
      </div>

      <DashboardHero
        userName={userName}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        timeFilterOptions={timeFilterOptions}
      />

      <DashboardKPICards
        totalFunds={state.totalFunds ?? 0}
        totalFilteredExpenses={totalFilteredExpenses}
        remainingBalanceFiltered={remainingBalanceFiltered}
        todaySpendingFiltered={todaySpendingFiltered}
        totalTransactionsFiltered={totalTransactionsFiltered}
        fundsTrendText="Available capital"
        fundsTrendIcon={TrendingUp}
        expTrendText="Total spent"
        expTrendIcon={TrendingDown}
        balTrendText={remainingBalanceFiltered < 0 ? "Over budget limit" : "Safe balance"}
        balTrendIcon={remainingBalanceFiltered < 0 ? AlertTriangle : ShieldCheck}
        todayTrendText="Today's total"
        todayTrendIcon={Zap}
        txTrendText="Active entries"
        txTrendIcon={Activity}
        renderSparkline={renderSparkline}
        fundsIllustration={fundsIllustration}
        expIllustration={expIllustration}
        balIllustration={balIllustration}
        todayIllustration={todayIllustration}
        txIllustration={txIllustration}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 xl:gap-8 pt-4 pb-2 text-left">
        <div className="bg-white dark:bg-[#0B0F19] border border-purple-200/60 dark:border-purple-900/50 hover:border-[#8B5CF6] dark:hover:border-[#A855F7] p-7 md:p-8 rounded-[24px] shadow-[0_12px_35px_-8px_rgba(139,92,246,0.18)] dark:shadow-[0_18px_45px_-8px_rgba(168,85,247,0.28)] hover:shadow-[0_22px_60px_-5px_rgba(139,92,246,0.38)] dark:hover:shadow-[0_28px_70px_-5px_rgba(168,85,247,0.52)] flex flex-col justify-between h-[460px] relative overflow-hidden text-left transform hover:-translate-y-2.5 transition-all duration-300 ease-out group">
          <div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Add Funds
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed max-w-[260px]">
                Add money to your wallet and track expenses easily.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = Number(depositAmount);
                if (val > 0) {
                  addFunds(val);
                  setDepositAmount("");
                }
              }}
              className="mt-11"
            >
              <div className="flex items-end justify-between mb-3.5">
                <label className="block text-base font-black text-slate-900 dark:text-white">
                  Amount (₹)
                </label>

                <svg width="56" height="36" viewBox="0 0 56 36" fill="none" className="overflow-visible select-none pointer-events-none">
                  <path d="M4 2L4.7 4.3L7 5L4.7 5.7L4 8L3.3 5.7L1 5L3.3 4.3L4 2Z" fill="#C084FC" />
                  <rect x="8" y="10" width="36" height="22" rx="6" fill="url(#purpleWalletGrad)" />
                  <circle cx="38" cy="21" r="2" fill="white" opacity="0.9" />
                  <ellipse cx="46" cy="31" rx="6.5" ry="2" fill="#FBBF24" opacity="0.6" />
                  <g filter="url(#coinDropShadow)">
                    <circle cx="45" cy="10" r="8.5" fill="url(#goldCoinGradient)" stroke="#FFFFFF" strokeWidth="1.2" />
                    <circle cx="45" cy="10" r="5.5" stroke="#D97706" strokeWidth="0.9" strokeDasharray="none" fill="none" opacity="0.6" />
                  </g>
                  <defs>
                    <linearGradient id="purpleWalletGrad" x1="8" y1="10" x2="44" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9333EA" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="goldCoinGradient" x1="36" y1="2" x2="54" y2="18" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FEF08A" />
                      <stop offset="0.5" stopColor="#FBBF24" />
                      <stop offset="1" stopColor="#D97706" />
                    </linearGradient>
                    <filter id="coinDropShadow" x="34" y="-1" width="22" height="22" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#78350F" floodOpacity="0.3" />
                    </filter>
                  </defs>
                </svg>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white font-black text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3.5 bg-[#F5F3FF] dark:bg-slate-900/90 border border-purple-200/60 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-[#635BFF] to-[#3B82F6] hover:from-[#544CF0] hover:to-[#2563EB] text-white text-sm font-extrabold rounded-xl shadow-[0_8px_20px_-4px_rgba(99,91,255,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(99,91,255,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer text-center"
              >
                Add Funds
              </button>
            </form>
          </div>

          <div className="pt-5 mt-10 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <ShieldCheck size={16} className="text-slate-400 dark:text-slate-500" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-purple-200/60 dark:border-purple-900/50 hover:border-[#8B5CF6] dark:hover:border-[#A855F7] p-6 md:p-7 rounded-[24px] shadow-[0_12px_35px_-8px_rgba(139,92,246,0.18)] dark:shadow-[0_18px_45px_-8px_rgba(168,85,247,0.28)] hover:shadow-[0_22px_60px_-5px_rgba(139,92,246,0.38)] dark:hover:shadow-[0_28px_70px_-5px_rgba(168,85,247,0.52)] flex flex-col justify-between space-y-4 relative h-[460px] transform hover:-translate-y-2.5 transition-all duration-300 ease-out group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Expense Overview
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Spending by category
                </p>
              </div>

              <div className="relative z-40" ref={card2DropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCard2DropdownOpen(!isCard2DropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F3FF] dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-extrabold rounded-xl border border-purple-200/60 dark:border-slate-800 hover:border-[#635BFF] transition-all cursor-pointer"
                >
                  <span>{timeFilter}</span>
                  <ChevronDown size={13} className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isCard2DropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isCard2DropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[175px] bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-slate-800/80 shadow-[0_20px_50px_-10px_rgba(99,91,255,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-[22px] p-2 z-[99999] transition-all duration-200 ease-out text-left space-y-1">
                    {timeFilterOptions.map((opt) => {
                      const isSelected = timeFilter === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setTimeFilter(opt);
                            setIsCard2DropdownOpen(false);
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

            {categoryDistribution.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                No expense data recorded.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-[160px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={54}
                        outerRadius={76}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        wrapperStyle={{ zIndex: 1000, outline: "none" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            return (
                              <div
                                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.4)] border ${
                                  darkMode
                                    ? "bg-[#0F172A] border-slate-700 text-white"
                                    : "bg-white border-purple-100 text-slate-900"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: data.payload.color || data.color }}
                                  />
                                  <span className="font-extrabold">{data.name}:</span>
                                  <span className="font-black text-[#635BFF] dark:text-purple-300">
                                    ₹{Number(data.value).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      TOTAL EXPENSES
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      ₹{totalFilteredExpenses.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {categoryDistribution.slice(0, 3).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-semibold text-[11px]">{item.percentage}%</span>
                        <span className="text-slate-900 dark:text-white font-black">
                          ₹{item.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-[#635BFF]/10 to-[#3B82F6]/10 dark:from-purple-950/60 dark:to-indigo-950/60 border border-purple-200/60 dark:border-purple-800/40 text-[#635BFF] dark:text-indigo-300 font-extrabold text-xs rounded-xl hover:from-[#635BFF]/20 hover:to-[#3B82F6]/20 transition-all text-center cursor-pointer mt-2"
          >
            View Full Analytics
          </button>
        </div>

        <div className="bg-white dark:bg-[#0B0F19] border border-purple-200/60 dark:border-purple-900/50 hover:border-[#8B5CF6] dark:hover:border-[#A855F7] p-6 md:p-7 rounded-[24px] shadow-[0_12px_35px_-8px_rgba(139,92,246,0.18)] dark:shadow-[0_18px_45px_-8px_rgba(168,85,247,0.28)] hover:shadow-[0_22px_60px_-5px_rgba(139,92,246,0.38)] dark:hover:shadow-[0_28px_70px_-5px_rgba(168,85,247,0.52)] flex flex-col justify-between space-y-4 text-left relative overflow-hidden h-[460px] transform hover:-translate-y-2.5 transition-all duration-300 ease-out group">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recent Expenses
              </h3>
              <button
                type="button"
                onClick={() => navigate("/history")}
                className="px-3 py-1 bg-[#F5F3FF] dark:bg-purple-950/40 text-[#635BFF] dark:text-indigo-400 font-extrabold text-xs rounded-xl hover:bg-purple-100/80 transition-all cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {filteredExpenses.length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold py-8 text-center">
                  No recent expenses recorded.
                </p>
              ) : (
                filteredExpenses.slice(0, 4).map((exp) => {
                  const catLower = (exp.category || "").toLowerCase();
                  let badgeBg = "bg-purple-100/90 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300";
                  let iconBg = "bg-purple-50 dark:bg-purple-950/40 border-purple-100/60 dark:border-purple-800/40";
                  
                  if (catLower.includes("food")) {
                    badgeBg = "bg-amber-100/90 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300";
                    iconBg = "bg-amber-50 dark:bg-amber-950/40 border-amber-100/60 dark:border-amber-800/40";
                  } else if (catLower.includes("bill")) {
                    badgeBg = "bg-blue-100/90 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300";
                    iconBg = "bg-blue-50 dark:bg-blue-950/40 border-blue-100/60 dark:border-blue-800/40";
                  }

                  return (
                    <div key={exp.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/30 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center text-base shrink-0`}>
                          {getCategoryIcon(exp.category)}
                        </div>
                        <div className="min-w-0 text-left">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {exp.name || exp.title}
                          </h4>
                          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                            {exp.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${badgeBg}`}>
                          {exp.category}
                        </span>
                        <span className="text-xs font-black text-rose-500">
                          ₹{Number(exp.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0B0F19] border border-indigo-100 dark:border-indigo-900/40 rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-left space-y-5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Add Funds</h3>
            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={addFundsInput}
                  onChange={(e) => setAddFundsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B4CFF]"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFundsModalOpen(false)}
                  className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gradient-to-r from-[#5B4CFF] to-[#3B82F6] text-white font-extrabold text-xs rounded-2xl cursor-pointer shadow-md"
                >
                  Confirm Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
