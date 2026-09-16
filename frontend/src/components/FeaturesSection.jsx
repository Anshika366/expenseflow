export default function FeaturesSection({ isDarkMode }) {
  const features = [
    {
      title: "Real-Time Tracking",
      description: "Log expenses instantly with smart categories and payment method tagging.",
      icon: "⚡",
      bgClass: isDarkMode ? "bg-amber-950/40 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "Budget Analytics",
      description: "Visual category distributions, median expenses, and budget overspent limits.",
      icon: "📊",
      bgClass: isDarkMode ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/50" : "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      title: "Export & Backup",
      description: "Download CSV statements, print financial ledgers, or backup full system JSON.",
      icon: "📑",
      bgClass: isDarkMode ? "bg-purple-950/40 text-purple-400 border-purple-900/50" : "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-8 lg:px-16 py-12 z-10 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
              isDarkMode
                ? "bg-[#0B0F19]/80 border-slate-800/80 hover:border-indigo-500/50"
                : "bg-white border-slate-200/80 hover:border-indigo-400 shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 border ${feat.bgClass}`}
            >
              {feat.icon}
            </div>
            <h3
              className={`text-base font-extrabold mb-1.5 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {feat.title}
            </h3>
            <p
              className={`text-xs leading-relaxed ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
