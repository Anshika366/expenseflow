from fastapi import APIRouter, HTTPException
from typing import Dict
from app.database import budgets_col

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

@router.get("/budgets", response_model=Dict[str, float])
async def get_budgets():
    try:
        budget_doc = await budgets_col.find_one({"_id": "global_budgets"})
        if budget_doc and "categories" in budget_doc:
            return budget_doc["categories"]
        return DEFAULT_BUDGETS
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/budgets", response_model=Dict[str, float])
async def update_budgets(payload: Dict[str, float]):
    try:
        await budgets_col.update_one(
            {"_id": "global_budgets"},
            {"$set": {"categories": payload}},
            upsert=True
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
