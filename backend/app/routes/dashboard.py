from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.database import expenses_col
from app.schemas import DashboardResponseModel, AppStateResponse, ExpenseModel
from app.utils import get_current_funds
from app.services.analytics import compute_dashboard_trends

router = APIRouter(prefix="/api", tags=["dashboard"])

@router.get("/dashboard", response_model=DashboardResponseModel)
async def get_dashboard_metrics():
    try:
        total_funds = await get_current_funds()
        expenses_cursor = expenses_col.find()
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(ExpenseModel(**exp))
            
        total_exp = sum(e.amount for e in expenses)
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        today_sp = sum(e.amount for e in expenses if e.date.startswith(today_str))
        
        sorted_exp = sorted(expenses, key=lambda x: x.date, reverse=True)
        recent = sorted_exp[:5]
        
        trends = compute_dashboard_trends(expenses, total_funds)
        
        return DashboardResponseModel(
            total_funds=total_funds,
            total_expenses=total_exp,
            remaining_balance=total_funds - total_exp,
            today_spending=today_sp,
            total_transactions=len(expenses),
            recent_expenses=recent,
            trends=trends
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard calculation failed: {str(e)}")

@router.get("/data", response_model=AppStateResponse)
async def get_all_data():
    try:
        total_funds = await get_current_funds()
        expenses_cursor = expenses_col.find()
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(ExpenseModel(**exp))
        return AppStateResponse(total_funds=total_funds, expenses=expenses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database fetch failed: {str(e)}")
