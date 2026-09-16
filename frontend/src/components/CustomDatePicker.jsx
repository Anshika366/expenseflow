import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function CustomDatePicker({ selectedDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDateClick = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${currentYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };
  
  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none hover:border-[#5B4CFF] focus:border-[#5B4CFF] transition-all w-36 cursor-pointer"
      >
        <CalendarIcon size={14} className="text-[#5B4CFF]" />
        <span>{selectedDate ? selectedDate.split('-').reverse().join('-') : "Select Date"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-slate-800 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-[9999] w-[260px] animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-600 dark:text-slate-300">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-600 dark:text-slate-300">
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {dayNames.map(d => (
              <span key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              
              const todayObj = new Date();
              const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
              const isToday = todayStr === dateStr;
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`w-7 h-7 mx-auto rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center
                    ${isSelected ? 'bg-[#5B4CFF] text-white shadow-md shadow-indigo-500/40 transform scale-110' : 
                      isToday ? 'border border-[#5B4CFF] text-[#5B4CFF] hover:bg-indigo-50 dark:hover:bg-indigo-950/50' : 
                      'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <button type="button" onClick={handleClear} className="text-xs font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-md transition-colors cursor-pointer">
              Clear
            </button>
            <button 
              type="button" 
              onClick={() => {
                const today = new Date();
                const ts = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                onChange(ts);
                setIsOpen(false);
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }} 
              className="text-xs font-black text-[#5B4CFF] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
