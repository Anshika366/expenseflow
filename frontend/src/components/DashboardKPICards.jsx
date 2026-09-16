function DashboardCard({
  title,
  amount,
  subtitle,
  illustration,
  icon: Icon,
  iconBgClass = "bg-[#D1FAE5] dark:bg-emerald-950/50 text-[#10B981]",
  amountClass = "text-[#10B981]",
  glowClass = "bg-purple-500/10 dark:bg-purple-500/20",
  cardBgClass = "bg-white dark:bg-[#0B0F19]",
  hoverBorderClass = "hover:border-[#8B5CF6]/70 dark:hover:border-[#A855F7]/80",
  hoverShadowClass = "hover:shadow-[0_20px_45px_-8px_rgba(139,92,246,0.26)] dark:hover:shadow-[0_22px_50px_-6px_rgba(168,85,247,0.38)]",
  accentLineColor = "bg-[#10B981] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]",
  sparkline,
  trendText,
  trendIcon: TrendIcon,
  trendClass = "text-[#10B981]",
  delayIndex = 0,
}) {
  return (
    <div
      style={{ animationDelay: `${delayIndex * 30}ms` }}
      className={`group relative overflow-hidden ${cardBgClass} border border-purple-200/60 dark:border-purple-900/50 rounded-[24px] p-4.5 pt-4 px-4.5 pb-3.5 min-h-[175px] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.14)] dark:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.24)] ${hoverShadowClass} ${hoverBorderClass} hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300 ease-out flex flex-col justify-between text-left animate-card-entrance cursor-pointer`}
    >
      <div className={`absolute -right-4 -top-4 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-25 group-hover:opacity-60 group-hover:scale-125 ${glowClass}`} />

      <div className="relative z-10 flex flex-col">
        <div className="flex items-center justify-between w-full gap-3">
          <span className="text-[11px] md:text-[12px] font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider">
            {title}
          </span>

          <div className="relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105">
            {illustration ? (
              <div className="w-9 h-9 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 shadow-[0_4px_12px_rgba(139,92,246,0.08)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)] border border-purple-100/80 dark:border-purple-800/40 flex items-center justify-center group-hover:border-purple-300 dark:group-hover:border-purple-600">
                {illustration}
              </div>
            ) : Icon ? (
              <div className={`w-9 h-9 rounded-2xl ${iconBgClass} flex items-center justify-center shadow-sm`}>
                <Icon size={15} />
              </div>
            ) : null}
          </div>
        </div>

        <div className={`text-[18px] md:text-[20px] lg:text-[21px] font-[800] tracking-tight leading-none mt-2.5 ${amountClass}`}>
          {typeof amount === "number" ? `₹${amount.toLocaleString("en-IN")}` : amount}
        </div>

        {subtitle && (
          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
            {subtitle}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-3.5 flex flex-col">
        <div className="h-[22px] w-full relative flex items-center overflow-hidden">
          {sparkline}
        </div>

        <div className={`h-[3px] group-hover:h-[4px] w-full rounded-full transition-all duration-300 mt-1 ${accentLineColor}`} />

        {trendText && (
          <div className={`flex items-center gap-1.5 text-[11px] md:text-[12px] font-semibold mt-2 break-words whitespace-normal leading-snug ${trendClass}`}>
            {TrendIcon && <TrendIcon size={12} className="shrink-0" />}
            <span className="break-words">{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardKPICards({
  totalFunds = 0,
  totalFilteredExpenses = 0,
  remainingBalanceFiltered = 0,
  todaySpendingFiltered = 0,
  totalTransactionsFiltered = 0,
  fundsTrendText,
  fundsTrendIcon,
  expTrendText,
  expTrendIcon,
  balTrendText,
  balTrendIcon,
  todayTrendText,
  todayTrendIcon,
  txTrendText,
  txTrendIcon,
  renderSparkline,
  fundsIllustration,
  expIllustration,
  balIllustration,
  todayIllustration,
  txIllustration,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      <DashboardCard
        title="Total Funds"
        amount={totalFunds}
        subtitle="Available Money"
        illustration={fundsIllustration}
        cardBgClass="bg-white dark:bg-[#0B0F19]"
        hoverBorderClass="hover:border-[#10B981]/70 dark:hover:border-[#10B981]/80"
        hoverShadowClass="hover:shadow-[0_20px_45px_-8px_rgba(16,185,129,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(16,185,129,0.4)]"
        accentLineColor="bg-[#10B981] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        amountClass="text-[#10B981]"
        glowClass="bg-[#10B981]/10 dark:bg-[#10B981]/20"
        trendText={fundsTrendText}
        trendIcon={fundsTrendIcon}
        trendClass="text-[#10B981]"
        sparkline={renderSparkline("funds", "#10B981", "sparkGrad1")}
        delayIndex={0}
      />

      <DashboardCard
        title="Total Expenses"
        amount={totalFilteredExpenses}
        subtitle="Money Spent"
        illustration={expIllustration}
        cardBgClass="bg-white dark:bg-[#0B0F19]"
        hoverBorderClass="hover:border-[#EF476F]/70 dark:hover:border-[#EF476F]/80"
        hoverShadowClass="hover:shadow-[0_20px_45px_-8px_rgba(239,71,111,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(239,71,111,0.4)]"
        accentLineColor="bg-[#EF476F] group-hover:shadow-[0_0_10px_rgba(239,71,111,0.5)]"
        amountClass="text-[#EF476F]"
        glowClass="bg-[#EF476F]/10 dark:bg-[#EF476F]/20"
        trendText={expTrendText}
        trendIcon={expTrendIcon}
        trendClass="text-[#EF476F]"
        sparkline={renderSparkline("expenses", "#EF476F", "sparkGrad2")}
        delayIndex={1}
      />

      <DashboardCard
        title="Remaining Balance"
        amount={
          remainingBalanceFiltered < 0
            ? `₹${Math.abs(remainingBalanceFiltered).toLocaleString()}`
            : `₹${remainingBalanceFiltered.toLocaleString()}`
        }
        subtitle="Money Left"
        illustration={balIllustration}
        cardBgClass="bg-white dark:bg-[#0B0F19]"
        hoverBorderClass={
          remainingBalanceFiltered < 0
            ? "hover:border-[#EF476F]/70 dark:hover:border-[#EF476F]/80"
            : "hover:border-[#10B981]/70 dark:hover:border-[#10B981]/80"
        }
        hoverShadowClass={
          remainingBalanceFiltered < 0
            ? "hover:shadow-[0_20px_45px_-8px_rgba(239,71,111,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(239,71,111,0.4)]"
            : "hover:shadow-[0_20px_45px_-8px_rgba(16,185,129,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(16,185,129,0.4)]"
        }
        accentLineColor={
          remainingBalanceFiltered < 0
            ? "bg-[#EF476F] group-hover:shadow-[0_0_10px_rgba(239,71,111,0.5)]"
            : "bg-[#10B981] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        }
        amountClass={
          remainingBalanceFiltered < 0 ? "text-[#EF476F]" : "text-[#10B981]"
        }
        glowClass={
          remainingBalanceFiltered < 0
            ? "bg-[#EF476F]/10 dark:bg-[#EF476F]/20"
            : "bg-[#10B981]/10 dark:bg-[#10B981]/20"
        }
        trendText={balTrendText}
        trendIcon={balTrendIcon}
        trendClass={
          remainingBalanceFiltered < 0 ? "text-[#EF476F]" : "text-[#10B981]"
        }
        sparkline={renderSparkline(
          "balance",
          remainingBalanceFiltered < 0 ? "#EF476F" : "#10B981",
          "sparkGrad3"
        )}
        delayIndex={2}
      />

      <DashboardCard
        title="Today's Spending"
        amount={todaySpendingFiltered}
        subtitle="Spent Today"
        illustration={todayIllustration}
        cardBgClass="bg-white dark:bg-[#0B0F19]"
        hoverBorderClass="hover:border-[#3B82F6]/70 dark:hover:border-[#3B82F6]/80"
        hoverShadowClass="hover:shadow-[0_20px_45px_-8px_rgba(59,130,246,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(59,130,246,0.4)]"
        accentLineColor="bg-[#3B82F6] group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        amountClass="text-[#3B82F6]"
        glowClass="bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20"
        trendText={todayTrendText}
        trendIcon={todayTrendIcon}
        trendClass="text-[#3B82F6]"
        sparkline={renderSparkline("today", "#3B82F6", "sparkGrad4")}
        delayIndex={3}
      />

      <DashboardCard
        title="Total Transactions"
        amount={totalTransactionsFiltered}
        subtitle="Expenses Recorded"
        illustration={txIllustration}
        cardBgClass="bg-white dark:bg-[#0B0F19]"
        hoverBorderClass="hover:border-[#7C3AED]/70 dark:hover:border-[#7C3AED]/80"
        hoverShadowClass="hover:shadow-[0_20px_45px_-8px_rgba(124,58,237,0.28)] dark:hover:shadow-[0_22px_50px_-6px_rgba(124,58,237,0.4)]"
        accentLineColor="bg-[#7C3AED] group-hover:shadow-[0_0_10px_rgba(124,58,237,0.5)]"
        amountClass="text-[#7C3AED]"
        glowClass="bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20"
        trendText={txTrendText}
        trendIcon={txTrendIcon}
        trendClass="text-[#7C3AED]"
        sparkline={renderSparkline("transactions", "#7C3AED", "sparkGrad5")}
        delayIndex={4}
      />
    </div>
  );
}
