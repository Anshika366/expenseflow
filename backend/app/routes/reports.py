from fastapi import APIRouter, HTTPException, Depends
from app.database import expenses_col
from app.schemas import ReportResponseModel, ExpenseModel, CategorySummaryModel, MonthlySummaryModel
from app.services.analytics import compute_analytics
from app.security import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

def _user_query(current_user: dict) -> dict:
    return {"user_id": str(current_user["_id"])}

async def _load_user_expenses(current_user: dict) -> list:
    query = _user_query(current_user)
    expenses_cursor = expenses_col.find(query)
    expenses = []
    async for exp in expenses_cursor:
        exp.pop("_id", None)
        try:
            expenses.append(ExpenseModel(**exp))
        except Exception:
            pass
    return expenses

@router.get("", response_model=ReportResponseModel)
async def get_reports(current_user: dict = Depends(get_current_user)):
    try:
        expenses = await _load_user_expenses(current_user)
        return compute_analytics(expenses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate reports: {str(e)}")

@router.get("/monthly")
async def get_monthly_report(current_user: dict = Depends(get_current_user)):
    try:
        expenses = await _load_user_expenses(current_user)
        report = compute_analytics(expenses)
        return {
            "monthly_summary": [m.model_dump() for m in report.monthly_summary]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate monthly report: {str(e)}")

@router.get("/category")
async def get_category_report(current_user: dict = Depends(get_current_user)):
    try:
        expenses = await _load_user_expenses(current_user)
        report = compute_analytics(expenses)
        return {
            "category_summary": [c.model_dump() for c in report.category_summary]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate category report: {str(e)}")
