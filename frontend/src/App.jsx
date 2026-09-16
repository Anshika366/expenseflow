import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

import Auth from "./pages/Auth";
import AddExpense from "./pages/AddExpense";
import ExpenseHistory from "./pages/ExpenseHistory";
import Settings from "./pages/Settings";
import Budgets from "./pages/Budgets";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reports = lazy(() => import("./pages/Reports"));

function PageLoader() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-3 border-indigo-200 border-t-[#5B4CFF] animate-spin" />
    </div>
  );
}

function AppLayout({ darkMode, setDarkMode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFD] dark:bg-[#050816] text-slate-900 dark:text-[#E5E7EB] font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#5B4CFF]/30 selection:text-[#5B4CFF] p-3 sm:p-5 md:p-6 pb-20 lg:pb-6 gap-3 sm:gap-5 items-stretch">
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 min-w-0 relative flex flex-col justify-between">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#5B4CFF]/10 via-[#8B5CF6]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#2F80ED]/10 via-[#EC4899]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth darkMode={darkMode} />} />
          <Route path="/reset-password" element={<Auth darkMode={darkMode} />} />

          <Route element={<ProtectedRoute />}>
            <Route
              element={<AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
            >
              <Route
                path="/dashboard"
                element={
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                }
              />
              <Route path="/expenses" element={<AddExpense />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/history" element={<ExpenseHistory />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/analytics" element={<Reports />} />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/settings"
                element={
                  <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}
