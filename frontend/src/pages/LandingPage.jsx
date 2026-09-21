import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Food & Dining",
      date: "Today",
      amount: 520,
      iconText: "🍔",
    },
    {
      id: 2,
      title: "Uber Ride",
      date: "Yesterday",
      amount: 450,
      iconText: "🚗",
    },
    {
      id: 3,
      title: "Shopping",
      date: "12 May, 2024",
      amount: 1250,
      iconText: "🛍️",
    },
    {
      id: 4,
      title: "Netflix Subscription",
      date: "12 May, 2024",
      amount: 649,
      iconText: "🎬",
    },
  ]);

  const [inputTitle, setInputTitle] = useState("");
  const [inputCategory, setInputCategory] = useState("Food");
  const [inputAmount, setInputAmount] = useState("");

  const handleAddNewExpense = (e) => {
    e.preventDefault();
    if (!inputTitle || !inputAmount) return;
    const parsedAmt = parseFloat(inputAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    const categoryConfig = {
      Food: "🍔",
      Travel: "🚗",
      Shopping: "🛍️",
      Bills: "🎬",
    };

    const newLog = {
      id: Date.now(),
      title: inputTitle,
      date: "Today",
      amount: parsedAmt,
      iconText: categoryConfig[inputCategory] || "💰",
    };

    setExpenses([newLog, ...expenses]);
    setInputTitle("");
    setInputAmount("");
  };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between relative overflow-x-hidden select-none transition-colors duration-500 ease-in-out ${
        isDarkMode
          ? "bg-[#060814] text-slate-100"
          : "bg-[#F4F6FC] text-[#1E293B]"
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body, html {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          padding: 0;
        }

        *, *::before, *::after {
          transition-property: color, background-color, border-color, box-shadow, opacity;
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(8deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
        }
        @keyframes floatSimple {
          0%, 100% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-9px) rotate(2deg); }
        }
        @keyframes floatRupee {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(8px) rotate(-8deg); }
        }

        @keyframes ambientPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); filter: drop-shadow(0 0 3px rgba(6,182,212,0.3)); }
          50% { opacity: 0.85; transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(6,182,212,0.7)); }
        }
        @keyframes purplePulse {
          0%, 100% { opacity: 0.4; transform: scale(1); filter: drop-shadow(0 0 3px rgba(139,92,246,0.3)); }
          50% { opacity: 0.9; transform: scale(1.2); filter: drop-shadow(0 0 12px rgba(139,92,246,0.7)); }
        }
        @keyframes subtleDrift {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.4; }
          50% { transform: translate(4px, -5px); opacity: 0.8; }
        }

        .animate-float-wallet { animation: floatSlow 7s ease-in-out infinite; }
        .animate-float-pie { animation: floatReverse 8.5s ease-in-out infinite 0.7s; }
        .animate-float-bars { animation: floatSimple 6s ease-in-out infinite 1.2s; }
        .animate-float-rupee { animation: floatRupee 7.5s ease-in-out infinite 1.8s; }

        .animate-dot-cyan { animation: ambientPulse 4s ease-in-out infinite; }
        .animate-dot-purple { animation: purplePulse 4.5s ease-in-out infinite; }
        .animate-dot-drift { animation: subtleDrift 6.5s ease-in-out infinite; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

        .mockup-dashboard-shadow-dark {
          box-shadow: 0 55px 115px -10px rgba(0, 0, 0, 0.92), 0 28px 55px -5px rgba(0, 0, 0, 0.65);
        }
        .mockup-dashboard-shadow-dark:hover {
          box-shadow: 0 65px 130px -12px rgba(0, 0, 0, 0.98), 0 32px 65px -5px rgba(0, 0, 0, 0.75);
        }

        .mockup-dashboard-shadow-light {
          box-shadow: 0 45px 95px -10px rgba(15, 23, 42, 0.28), 0 20px 40px -5px rgba(15, 23, 42, 0.16);
        }
        .mockup-dashboard-shadow-light:hover {
          box-shadow: 0 55px 110px -12px rgba(15, 23, 42, 0.35), 0 25px 50px -5px rgba(15, 23, 42, 0.2);
        }

        .shadow-wallet-badge-light {
          box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.28), 0 10px 22px -4px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        .shadow-pie-badge-light {
          box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.28), 0 10px 22px -4px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        .shadow-bars-badge-light {
          box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.28), 0 10px 22px -4px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        .shadow-rupee-badge-light {
          box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.28), 0 10px 22px -4px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .shadow-badge-dark {
          box-shadow: 0 22px 45px -4px rgba(0, 0, 0, 0.92), 0 12px 25px -4px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[130px] transition-all duration-500 ease-in-out ${
            isDarkMode ? "bg-indigo-950/30" : "bg-[#EEF2FF]"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-500 ease-in-out ${
            isDarkMode ? "bg-purple-950/20" : "bg-[#F5F3FF]"
          }`}
        />

        <svg
          className="absolute w-full h-full opacity-30 transition-all duration-500 ease-in-out"
          fill="none"
          viewBox="0 0 1440 900"
        >
          <path
            d="M 550 180 C 750 100, 1100 220, 1250 480 C 1300 620, 1100 780, 800 750"
            stroke={isDarkMode ? "#312E81" : "#C7D2FE"}
            strokeWidth="1.5"
            strokeDasharray="6 14"
          />
        </svg>

        <div className={`absolute top-[18%] left-[25.5%] w-2.5 h-2.5 rounded-full animate-dot-cyan ${isDarkMode ? "bg-cyan-400" : "bg-indigo-300"}`} />
        <div
          className={`absolute top-[25%] left-[35.5%] w-2 h-2 rounded-full animate-dot-purple ${isDarkMode ? "bg-purple-400" : "bg-purple-300"}`}
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className={`absolute bottom-[36%] left-[8.5%] w-2.5 h-2.5 rounded-full animate-dot-cyan ${isDarkMode ? "bg-cyan-400" : "bg-blue-400"}`}
        />
        <div
          className={`absolute bottom-[18%] left-[16.5%] w-2.5 h-2.5 rounded-full animate-dot-drift ${isDarkMode ? "bg-blue-500" : "bg-indigo-400"}`}
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className={`absolute top-[34.5%] right-[2.5%] w-2.5 h-2.5 rounded-full animate-dot-purple ${isDarkMode ? "bg-pink-500" : "bg-pink-400"}`}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`absolute bottom-[23%] left-[48.5%] w-2 h-2 rounded-full animate-dot-purple ${isDarkMode ? "bg-purple-500" : "bg-purple-400"}`}
          style={{ animationDelay: "1.7s" }}
        />
      </div>

      <header className="w-full z-40 py-5 px-8 lg:px-16 flex justify-center flex-shrink-0">
        <nav className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all duration-300">
              EF
            </div>
            <span
              className={`font-extrabold text-xl tracking-tight transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-white" : "text-[#1E1B4B]"
              }`}
            >
              ExpenseFlow
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
              className={`w-14 h-7 rounded-full p-0.5 border cursor-pointer hover:scale-105 active:scale-95 transition-colors duration-700 ease-in-out relative ${
                isDarkMode
                  ? "bg-[#0F172A] border-slate-700 shadow-inner"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1) transform ${
                  isDarkMode
                    ? "translate-x-[26px] bg-indigo-500 text-white shadow-indigo-500/50"
                    : "translate-x-0.5 bg-amber-400 text-white shadow-amber-400/50"
                }`}
              >
                {isDarkMode ? "🌙" : "☀️"}
              </div>
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="group bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
            >
              Get Started <span className="group-hover:translate-x-0.5 transition-transform duration-300">↗</span>
            </button>
          </div>
        </nav>
      </header>

      <HeroSection
        isDarkMode={isDarkMode}
        navigate={navigate}
        expenses={expenses}
        inputTitle={inputTitle}
        setInputTitle={setInputTitle}
        inputCategory={inputCategory}
        setInputCategory={setInputCategory}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        handleAddNewExpense={handleAddNewExpense}
      />

      <footer
        className={`w-full border-t py-4 backdrop-blur-md z-20 flex-shrink-0 transition-colors duration-500 ease-in-out ${
          isDarkMode
            ? "border-slate-900 bg-slate-950/40"
            : "border-slate-200/40 bg-white/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-5 h-5 bg-[#4F46E5] rounded-md flex items-center justify-center text-white font-extrabold text-[10px]">
              EF
            </div>
            <span
              className={`font-bold transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-slate-300" : "text-slate-800"
              }`}
            >
              ExpenseFlow
            </span>
            <span>| © 2026 ExpenseFlow. All rights reserved.</span>
          </div>
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
            Made with ❤️ in India
          </div>
        </div>
      </footer>
    </div>
  );
}
