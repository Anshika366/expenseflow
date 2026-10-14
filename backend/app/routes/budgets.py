from fastapi import APIRouter, HTTPException, Depends
from typing import Dict
from app.database import budgets_col
from app.security import get_current_user

router = APIRouter(prefix="/api", tags=["budgets"])

DEFAULT_BUDGETS = {
    "Food": 4000,
    "Shopping": 3000,
    "Bills": 5000,
    "Transport": 2000,
    "Entertainment": 1500,
    "Healthcare": 2500,
    "Others": 1000,
}

def _budgets_key(current_user: dict) -> str:
    return f"budgets_{str(current_user['_id'])}"

@router.get("/budgets", response_model=Dict[str, float])
async def get_budgets(current_user: dict = Depends(get_current_user)):
    try:
        user_key = _budgets_key(current_user)
        budget_doc = await budgets_col.find_one({"_id": user_key})
        if budget_doc and "categories" in budget_doc:
            return budget_doc["categories"]
        
        # Safe fallback: if user has not set personal budgets, read global_budgets as template without mutating it
        global_doc = await budgets_col.find_one({"_id": "global_budgets"})
        if global_doc and "categories" in global_doc:
            return global_doc["categories"]

        return DEFAULT_BUDGETS
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/budgets", response_model=Dict[str, float])
async def update_budgets(
    payload: Dict[str, float],
    current_user: dict = Depends(get_current_user),
):
    try:
        user_key = _budgets_key(current_user)
        user_id = str(current_user["_id"])
        await budgets_col.update_one(
            {"_id": user_key},
            {"$set": {"user_id": user_id, "categories": payload}},
            upsert=True
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/budgets", response_model=Dict[str, str])
async def delete_user_budgets(current_user: dict = Depends(get_current_user)):
    try:
        user_key = _budgets_key(current_user)
        await budgets_col.delete_one({"_id": user_key})
        return {"message": "User budgets reset to defaults."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
