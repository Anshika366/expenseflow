from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from app.database import expenses_col, system_col
from app.schemas import ExpenseModel, EditExpenseModel

router = APIRouter(prefix="/api/expenses", tags=["expenses"])

@router.get("", response_model=List[ExpenseModel])
async def get_expenses(
    sort: Optional[str] = Query(default=None, description="Field to sort by: date, amount, name"),
    order: Optional[str] = Query(default="desc", description="Sort order: asc, desc")
):
    try:
        expenses_cursor = expenses_col.find()
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(ExpenseModel(**exp))

        if sort:
            reverse_flag = (order.lower() == "desc")
            if sort == "amount":
                expenses.sort(key=lambda x: x.amount, reverse=reverse_flag)
            elif sort == "name":
                expenses.sort(key=lambda x: x.name.lower(), reverse=reverse_flag)
            elif sort == "date":
                expenses.sort(key=lambda x: x.date, reverse=reverse_flag)
        return expenses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not fetch expenses: {str(e)}")

@router.get("/next-id")
async def get_next_id():
    counter_doc = await system_col.find_one({"_id": "expense_id_counter"})
    current_seq = counter_doc.get("seq", 0) if counter_doc else 0
    next_id_str = f"EXP-{current_seq + 1:04d}"
    return {"next_id": next_id_str}

@router.get("/{expense_id}", response_model=ExpenseModel)
async def get_expense_by_id(expense_id: str):
    exp = await expenses_col.find_one({"id": expense_id})
    if not exp:
        raise HTTPException(status_code=404, detail="Expense item not found.")
    exp.pop("_id", None)
    return ExpenseModel(**exp)

@router.post("", response_model=ExpenseModel, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: ExpenseModel):
    existing = await expenses_col.find_one({"id": expense.id})
    if existing:
        raise HTTPException(status_code=400, detail="An expense with this ID already exists.")
    try:
        await expenses_col.insert_one(expense.model_dump())
        await system_col.find_one_and_update(
            {"_id": "expense_id_counter"},
            {"$inc": {"seq": 1}},
            upsert=True
        )
        return expense
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save expense: {str(e)}")

@router.put("/{expense_id}", response_model=ExpenseModel)
async def update_expense(expense_id: str, payload: EditExpenseModel):
    existing = await expenses_col.find_one({"id": expense_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense item not found.")
    try:
        updated_data = payload.model_dump()
        await expenses_col.update_one({"id": expense_id}, {"$set": updated_data})
        updated_data["id"] = expense_id
        return ExpenseModel(**updated_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not update: {str(e)}")

@router.delete("/{expense_id}")
async def delete_expense(expense_id: str):
    result = await expenses_col.delete_one({"id": expense_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense item was not found.")
    return {"message": f"Successfully deleted {expense_id}"}
