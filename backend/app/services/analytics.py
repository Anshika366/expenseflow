from datetime import datetime, timedelta
from typing import List
from app.schemas import (
    ExpenseModel,
    ReportResponseModel,
    CategorySummaryModel,
    MonthlySummaryModel,
    TrendItemModel,
    DashboardTrendsModel
)

def compute_analytics(expenses: List[ExpenseModel]) -> ReportResponseModel:
    if not expenses:
        return ReportResponseModel(
            highest_expense=None,
            lowest_expense=None,
            average_expense=0.0,
            category_summary=[],
            monthly_summary=[],
            weekly_summary=[]
        )

    highest = max(expenses, key=lambda x: x.amount)
    lowest = min(expenses, key=lambda x: x.amount)
    total_amt = sum(x.amount for x in expenses)
    avg_amt = total_amt / len(expenses)

    cat_map = {}
    for exp in expenses:
        cat_map[exp.category] = cat_map.get(exp.category, 0.0) + exp.amount

    cat_summaries = []
    for cat, amt in cat_map.items():
        pct = (amt / total_amt * 100) if total_amt > 0 else 0.0
        cat_summaries.append(CategorySummaryModel(category=cat, amount=amt, percentage=round(pct, 2)))

    month_map = {}
    for exp in expenses:
        month_key = exp.date[:7] if len(exp.date) >= 7 else exp.date
        month_map[month_key] = month_map.get(month_key, 0.0) + exp.amount

    month_summaries = [MonthlySummaryModel(month=k, amount=v) for k, v in month_map.items()]

    return ReportResponseModel(
        highest_expense=highest,
        lowest_expense=lowest,
        average_expense=round(avg_amt, 2),
        category_summary=cat_summaries,
        monthly_summary=month_summaries,
        weekly_summary=month_summaries
    )

def compute_dashboard_trends(expenses: List[ExpenseModel], total_funds: float) -> DashboardTrendsModel:
    now = datetime.utcnow()
    current_month_str = now.strftime("%Y-%m")
    
    prev_month_date = (now.replace(day=1) - timedelta(days=1))
    prev_month_str = prev_month_date.strftime("%Y-%m")
    
    today_str = now.strftime("%Y-%m-%d")
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    curr_month_expenses = [e for e in expenses if e.date.startswith(current_month_str)]
    prev_month_expenses = [e for e in expenses if e.date.startswith(prev_month_str)]

    curr_exp_sum = sum(e.amount for e in curr_month_expenses)
    prev_exp_sum = sum(e.amount for e in prev_month_expenses)

    curr_tx_count = len(curr_month_expenses)
    prev_tx_count = len(prev_month_expenses)

    today_exp_sum = sum(e.amount for e in expenses if e.date.startswith(today_str))
    yesterday_exp_sum = sum(e.amount for e in expenses if e.date.startswith(yesterday_str))

    def calc_trend(current: float, previous: float, period_label: str, zero_prev_text: str):
        if previous <= 0:
            if current > 0:
                return TrendItemModel(
                    percentage=None,
                    direction="up",
                    label=period_label,
                    text=zero_prev_text,
                    sparkline=[]
                )
            else:
                return TrendItemModel(
                    percentage=None,
                    direction="neutral",
                    label=period_label,
                    text="No comparison available",
                    sparkline=[]
                )
        
        diff = current - previous
        pct = round(abs(diff) / previous * 100, 1)
        if diff > 0:
            return TrendItemModel(
                percentage=pct,
                direction="up",
                label=period_label,
                text=f"↑ {pct}% {period_label}",
                sparkline=[]
            )
        elif diff < 0:
            return TrendItemModel(
                percentage=pct,
                direction="down",
                label=period_label,
                text=f"↓ {pct}% {period_label}",
                sparkline=[]
            )
        else:
            return TrendItemModel(
                percentage=0.0,
                direction="neutral",
                label=period_label,
                text=f"No change {period_label}",
                sparkline=[]
            )

    exp_trend = calc_trend(curr_exp_sum, prev_exp_sum, "vs last month", "First month of activity")
    tx_trend = calc_trend(float(curr_tx_count), float(prev_tx_count), "vs last month", "First month of activity")
    today_trend = calc_trend(today_exp_sum, yesterday_exp_sum, "vs yesterday", "New spending today")

    funds_trend = TrendItemModel(
        percentage=None,
        direction="neutral" if total_funds == 0 else "up",
        label="vs last month",
        text="Initial wallet setup" if total_funds > 0 else "No change from last month",
        sparkline=[]
    )

    curr_bal = total_funds - curr_exp_sum
    prev_bal = total_funds - prev_exp_sum
    bal_trend = calc_trend(curr_bal, prev_bal, "vs last month", "No comparison available")

    date_sparklines = []
    for i in range(6, -1, -1):
        day_d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        day_exps = [e.amount for e in expenses if e.date.startswith(day_d)]
        date_sparklines.append(sum(day_exps))

    exp_trend.sparkline = date_sparklines
    today_trend.sparkline = date_sparklines
    tx_trend.sparkline = [float(len([e for e in expenses if e.date.startswith((now - timedelta(days=i)).strftime("%Y-%m-%d"))])) for i in range(6, -1, -1)]
    funds_trend.sparkline = [total_funds] * 7
    bal_trend.sparkline = [max(0.0, total_funds - s) for s in date_sparklines]

    return DashboardTrendsModel(
        funds=funds_trend,
        expenses=exp_trend,
        balance=bal_trend,
        today=today_trend,
        transactions=tx_trend
    )
