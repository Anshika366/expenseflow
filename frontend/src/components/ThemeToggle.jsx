import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ darkMode, setDarkMode, className = "" }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setDarkMode && setDarkMode(!darkMode)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setDarkMode && setDarkMode(!darkMode);
        }
      }}
      className={`w-[100px] h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 flex items-center justify-between relative cursor-pointer shadow-inner transition-colors duration-300 select-none ${className}`}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="w-1/2 flex justify-center items-center z-10 text-slate-400 dark:text-slate-500">
        <Sun size={15} />
      </div>

      <div className="w-1/2 flex justify-center items-center z-10 text-slate-400 dark:text-slate-500">
        <Moon size={15} />
      </div>

      <div
        className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[#5B4CFF] to-[#3B82F6] dark:from-[#311075] dark:to-[#6D28D9] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 transition-transform duration-300 ease-out z-20 ${
          darkMode ? "translate-x-[60px]" : "translate-x-0"
        }`}
      >
        {darkMode ? (
          <Moon size={14} className="text-white fill-current" />
        ) : (
          <Sun size={14} className="text-white fill-current" />
        )}
      </div>
    </div>
  );
}
