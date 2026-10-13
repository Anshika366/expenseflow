from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from app.database import expenses_col, system_col
from app.schemas import DashboardResponseModel, AppStateResponse, ExpenseModel
from app.security import get_current_user
from app.services.analytics import compute_dashboard_trends

router = APIRouter(prefix="/api", tags=["dashboard"])

def _user_query(current_user: dict) -> dict:
    """User-scoped query."""
    return {"user_id": str(current_user["_id"])}

def _funds_key(current_user: dict) -> str:
    """Per-user funds key in the system collection."""
    return f"total_funds_{str(current_user['_id'])}"

@router.get("/dashboard", response_model=DashboardResponseModel)
async def get_dashboard_metrics(current_user: dict = Depends(get_current_user)):
    try:
        funds_key = _funds_key(current_user)
        funds_doc = await system_col.find_one({"_id": funds_key})
        total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0

        query = _user_query(current_user)
        expenses_cursor = expenses_col.find(query)
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            try:
                expenses.append(ExpenseModel(**exp))
            except Exception:
                pass

        total_exp = sum(e.amount for e in expenses)
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        today_sp = sum(e.amount for e in expenses if e.date.startswith(today_str))

        sorted_exp = sorted(expenses, key=lambda x: x.date, reverse=True)
        # FRD requires exactly 3 recent transactions
        recent = sorted_exp[:3]

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
async def get_all_data(current_user: dict = Depends(get_current_user)):
    try:
        funds_key = _funds_key(current_user)
        funds_doc = await system_col.find_one({"_id": funds_key})
        total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0

        query = _user_query(current_user)
        expenses_cursor = expenses_col.find(query)
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            try:
                expenses.append(ExpenseModel(**exp))
            except Exception:
                pass
        return AppStateResponse(total_funds=total_funds, expenses=expenses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database fetch failed: {str(e)}")
