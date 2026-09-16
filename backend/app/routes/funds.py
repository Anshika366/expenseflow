from fastapi import APIRouter, HTTPException
from app.database import system_col
from app.utils import get_current_funds

router = APIRouter(prefix="/api/funds", tags=["funds"])

@router.get("/total")
async def get_total_funds():
    total = await get_current_funds()
    return {"total_funds": total}

@router.post("")
async def add_funds(amount: float):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount to add must be greater than zero.")
    try:
        result = await system_col.find_one_and_update(
            {"_id": "total_funds"},
            {"$inc": {"amount": amount}},
            upsert=True,
            return_document=True
        )
        return {"message": "Funds successfully updated!", "total_funds": result["amount"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
