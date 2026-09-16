import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import api from "../services/api";

export default function Auth({ darkMode }) {
  const { dispatch, fetchAppData } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMessage("");
    setLoading(true);

    if (view === "signup" && !name.trim()) {
      setValidationError("Please enter your name.");
      setLoading(false);
      return;
    }

    if (view === "reset") {
      if (!email.trim()) {
        setValidationError("Please enter your email address.");
        setLoading(false);
        return;
      }
      if (!password || password.length < 6) {
        setValidationError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setValidationError("Confirm password does not match.");
        setLoading(false);
        return;
      }
    }

    try {
      if (view === "reset") {
        const response = await api.post("/auth/reset-password", {
          email: email.trim(),
          new_password: password,
        });
        setSuccessMessage(response.data.message || "Password updated successfully. Please log in.");
        setView("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        const endpoint = view === "signup" ? "/auth/signup" : "/auth/login";
        const payload =
          view === "signup"
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password };

        const response = await api.post(endpoint, payload);
        const { access_token, user } = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("isAuthenticated", "true");

        dispatch({
          type: "SET_USER",
          payload: user,
          token: access_token,
        });

        if (fetchAppData) {
          await fetchAppData();
        }

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setValidationError(err.response.data.detail[0]?.msg || "Validation error occurred.");
        } else {
          setValidationError(err.response.data.detail);
        }
      } else if (err.message === "Network Error" || !err.response) {
        setValidationError("Unable to connect to server. Please check backend API status.");
      } else {
        setValidationError("An authentication error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getHeading = () => {
    switch (view) {
      case "signup":
        return "Create Account";
      case "reset":
        return "Reset Password";
      default:
        return "Welcome Back";
    }
  };

  const getSubheading = () => {
    switch (view) {
      case "signup":
        return "Join ExpenseFlow to track balances";
      case "reset":
        return "Enter your email and new password";
      default:
        return "Login to manage your ledger";
    }
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    switch (view) {
      case "signup":
        return "Sign Up";
      case "reset":
        return "Update Password";
      default:
        return "Log In";
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ease-in-out relative overflow-hidden ${
        darkMode ? "bg-[#060814] text-slate-100" : "bg-[#F4F6FC] text-[#1E293B]"
      }`}
    >
      <style>{`
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(14px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2.5px); }
        }
        @keyframes badgeFloat1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes badgeFloat2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-card-entrance {
          animation: cardEntrance 380ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-logo-float {
          animation: logoFloat 4s ease-in-out infinite;
        }
        .animate-badge-float-1 {
          animation: badgeFloat1 8s ease-in-out infinite;
        }
        .animate-badge-float-2 {
          animation: badgeFloat2 9s ease-in-out infinite;
        }
      `}</style>

      <svg className="absolute inset-0 w-full h-full opacity-[0.22] dark:opacity-[0.14] pointer-events-none transition-opacity duration-500" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="auth-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke={darkMode ? "#312E81" : "#C7D2FE"} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid-pattern)" />
      </svg>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[140px] transition-all duration-500 ease-in-out ${
            darkMode ? "bg-indigo-950/40" : "bg-indigo-200/50"
          }`}
        />
        <div
          className={`absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full blur-[120px] transition-all duration-500 ease-in-out ${
            darkMode ? "bg-indigo-950/40" : "bg-indigo-100/70"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full blur-[120px] transition-all duration-500 ease-in-out ${
            darkMode ? "bg-purple-950/20" : "bg-purple-100/70"
          }`}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -top-5 -left-4 md:-left-8 z-20 animate-badge-float-1 p-2.5 rounded-2xl bg-white/95 dark:bg-[#0B0F19]/90 border border-white/90 dark:border-slate-800/80 shadow-[0_16px_35px_-5px_rgba(15,23,42,0.22)] dark:shadow-[0_16px_35px_-5px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center gap-2 text-[11px] font-bold transition-all duration-500 opacity-95 pointer-events-none select-none">
          <span className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">💳</span>
          <span className="text-slate-700 dark:text-slate-200">Secure Ledger</span>
        </div>

        <div className="absolute -bottom-5 -right-4 md:-right-8 z-20 animate-badge-float-2 p-2.5 rounded-2xl bg-white/95 dark:bg-[#0B0F19]/90 border border-white/90 dark:border-slate-800/80 shadow-[0_16px_35px_-5px_rgba(15,23,42,0.22)] dark:shadow-[0_16px_35px_-5px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center gap-2 text-[11px] font-bold transition-all duration-500 opacity-95 pointer-events-none select-none">
          <span className="w-6 h-6 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">✨</span>
          <span className="text-slate-700 dark:text-slate-200">Expense Analytics</span>
        </div>

        <div
          className={`w-full border p-8 rounded-[28px] z-10 animate-card-entrance transition-all duration-700 cubic-bezier(0.16,1,0.3,1) hover:-translate-y-1 hover:scale-[1.006] ${
            darkMode
              ? "bg-[#0B0F19]/90 border-slate-800/80 shadow-[0_55px_115px_-10px_rgba(0,0,0,0.92),0_28px_55px_-5px_rgba(0,0,0,0.65)] backdrop-blur-xl"
              : "bg-white/95 border-white shadow-[0_45px_95px_-10px_rgba(15,23,42,0.28),0_20px_40px_-5px_rgba(15,23,42,0.16)] backdrop-blur-xl"
          }`}
        >
          <div className="text-center space-y-1.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/30 animate-logo-float mx-auto mb-3 transition-all duration-300">
              EF
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight transition-colors duration-500">
              {getHeading()}
            </h2>
            <p className="text-slate-400 text-xs font-medium transition-colors duration-500">
              {getSubheading()}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2.5 text-[11px] font-bold text-left leading-normal shadow-sm shadow-red-500/10 transition-all duration-300">
              <span className="text-sm shrink-0">⚠️</span>
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2.5 text-[11px] font-bold text-left leading-normal shadow-sm shadow-emerald-500/10 transition-all duration-300">
              <span className="text-sm shrink-0">✅</span>
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "signup" && (
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="auth-name"
                  className="text-[9px] font-bold tracking-wider text-slate-400 uppercase transition-colors duration-500"
                >
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Emma Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-all duration-300 ease-in-out ${
                    darkMode
                      ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                      : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
                  }`}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="auth-email"
                className="text-[9px] font-bold tracking-wider text-slate-400 uppercase transition-colors duration-500"
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="emma@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                    : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
                }`}
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="auth-pass"
                className="text-[9px] font-bold tracking-wider text-slate-400 uppercase transition-colors duration-500"
              >
                {view === "reset" ? "New Password" : "Password"}
              </label>
              <input
                id="auth-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-all duration-300 ease-in-out ${
                  darkMode
                    ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                    : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
                }`}
                required
              />
              {view === "login" && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setView("reset");
                      setValidationError("");
                      setSuccessMessage("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition-colors duration-300"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {view === "reset" && (
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="auth-confirm-pass"
                  className="text-[9px] font-bold tracking-wider text-slate-400 uppercase transition-colors duration-500"
                >
                  Confirm New Password
                </label>
                <input
                  id="auth-confirm-pass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-all duration-300 ease-in-out ${
                    darkMode
                      ? "bg-slate-900/90 border-slate-800 text-white placeholder-slate-600 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                      : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
                  }`}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all duration-250 ease-in-out shadow-md shadow-indigo-600/10 cursor-pointer mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{getButtonText()}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-250 inline-block">→</span>
            </button>
          </form>

          <div className="text-center pt-5">
            {view === "reset" ? (
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setValidationError("");
                  setSuccessMessage("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition-colors duration-300"
              >
                Back to Log In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setView(view === "signup" ? "login" : "signup");
                  setValidationError("");
                  setSuccessMessage("");
                }}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer transition-colors duration-300"
              >
                {view === "signup"
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
