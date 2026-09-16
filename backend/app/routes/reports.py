from fastapi import APIRouter, HTTPException
from app.database import expenses_col
from app.schemas import ReportResponseModel, ExpenseModel
from app.services.analytics import compute_analytics

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("", response_model=ReportResponseModel)
async def get_reports():
    try:
        expenses_cursor = expenses_col.find()
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(ExpenseModel(**exp))
        return compute_analytics(expenses)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate reports: {str(e)}")
