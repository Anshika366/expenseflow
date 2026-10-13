from fastapi import APIRouter, HTTPException, Depends
from app.database import system_col
from app.security import get_current_user

router = APIRouter(prefix="/api/funds", tags=["funds"])

def _funds_key(current_user: dict) -> str:
    return f"total_funds_{str(current_user['_id'])}"

@router.get("/total")
async def get_total_funds(current_user: dict = Depends(get_current_user)):
    funds_key = _funds_key(current_user)
    funds_doc = await system_col.find_one({"_id": funds_key})
    total = funds_doc.get("amount", 0.0) if funds_doc else 0.0
    return {"total_funds": total}

@router.post("")
async def add_funds(amount: float, current_user: dict = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount to add must be greater than zero.")
    try:
        funds_key = _funds_key(current_user)
        result = await system_col.find_one_and_update(
            {"_id": funds_key},
            {"$inc": {"amount": amount}},
            upsert=True,
            return_document=True
        )
        return {"message": "Funds successfully updated!", "total_funds": result["amount"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
