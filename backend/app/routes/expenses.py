import math
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.database import expenses_col, system_col
from app.schemas import ExpenseModel, EditExpenseModel, PaginatedExpensesResponse
from app.security import get_current_user

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


def _build_query(current_user: dict) -> dict:
    return {"user_id": str(current_user["_id"])}



MAX_PAGE_SIZE = 200
DEFAULT_PAGE_SIZE = 50

@router.get("", response_model=PaginatedExpensesResponse)
async def get_expenses(
    sort: Optional[str] = Query(default=None, description="Sort field: date | amount | name"),
    order: Optional[str] = Query(default="desc", description="Sort order: asc | desc"),
    category: Optional[str] = Query(default=None, description="Filter by category (exact match, case-insensitive)"),
    date: Optional[str] = Query(default=None, description="Filter by exact date (YYYY-MM-DD)"),
    date_from: Optional[str] = Query(default=None, description="Filter expenses on or after this date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(default=None, description="Filter expenses on or before this date (YYYY-MM-DD)"),
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE, description="Items per page"),
    current_user: dict = Depends(get_current_user),
):
    try:
        query = _build_query(current_user)

        if category:
            import re
            query["category"] = {"$regex": f"^{re.escape(category.strip())}$", "$options": "i"}

        if date:
            query["date"] = date.strip()
        else:
            date_clause: dict = {}
            if date_from:
                date_clause["$gte"] = date_from.strip()
            if date_to:
                date_clause["$lte"] = date_to.strip()
            if date_clause:
                query["date"] = date_clause

        expenses_cursor = expenses_col.find(query)
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            try:
                expenses.append(ExpenseModel(**exp))
            except Exception:
                pass

        if sort:
            reverse_flag = (order.lower() == "desc")
            if sort == "amount":
                expenses.sort(key=lambda x: x.amount, reverse=reverse_flag)
            elif sort == "name":
                expenses.sort(key=lambda x: x.name.lower(), reverse=reverse_flag)
            elif sort == "date":
                expenses.sort(key=lambda x: x.date, reverse=reverse_flag)
        else:
            expenses.sort(key=lambda x: x.date, reverse=True)

        total = len(expenses)
        total_pages = max(1, math.ceil(total / page_size))
        page = min(page, total_pages)
        start = (page - 1) * page_size
        end = start + page_size
        page_items = expenses[start:end]

        return PaginatedExpensesResponse(
            items=page_items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch expenses: {str(e)}")



@router.get("/next-id")
async def get_next_id(current_user: dict = Depends(get_current_user)):
    counter_doc = await system_col.find_one({"_id": "expense_id_counter"})
    current_seq = counter_doc.get("seq", 0) if counter_doc else 0
    next_id_str = f"EXP-{current_seq + 1:04d}"
    return {"next_id": next_id_str}



@router.get("/{expense_id}", response_model=ExpenseModel)
async def get_expense_by_id(expense_id: str, current_user: dict = Depends(get_current_user)):
    query = _build_query(current_user)
    query["id"] = expense_id
    exp = await expenses_col.find_one(query)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense item not found.")
    exp.pop("_id", None)
    return ExpenseModel(**exp)



@router.post("", response_model=ExpenseModel, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseModel, current_user: dict = Depends(get_current_user)):
    existing = await expenses_col.find_one({"id": expense.id})
    if existing:
        raise HTTPException(status_code=400, detail="An expense with this ID already exists.")
    try:
        doc = expense.model_dump()
        doc["user_id"] = str(current_user["_id"])
        await expenses_col.insert_one(doc)
        await system_col.find_one_and_update(
            {"_id": "expense_id_counter"},
            {"$inc": {"seq": 1}},
            upsert=True
        )
        return ExpenseModel(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save expense: {str(e)}")



@router.put("/{expense_id}", response_model=ExpenseModel)
async def update_expense(
    expense_id: str,
    payload: EditExpenseModel,
    current_user: dict = Depends(get_current_user),
):
    query = _build_query(current_user)
    query["id"] = expense_id
    existing = await expenses_col.find_one(query)
    if not existing:
        raise HTTPException(status_code=404, detail="Expense item not found.")
    try:
        updated_data = payload.model_dump()
        await expenses_col.update_one({"id": expense_id}, {"$set": updated_data})
        updated_data["id"] = expense_id
        updated_data["user_id"] = existing.get("user_id")
        return ExpenseModel(**updated_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not update: {str(e)}")



@router.delete("/{expense_id}")
async def delete_expense(expense_id: str, current_user: dict = Depends(get_current_user)):
    query = _build_query(current_user)
    query["id"] = expense_id
    result = await expenses_col.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense item was not found.")
    return {"message": f"Successfully deleted {expense_id}"}
