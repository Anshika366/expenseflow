from app.database import system_col

async def get_next_expense_id() -> str:
    counter_doc = await system_col.find_one_and_update(
        {"_id": "expense_id_counter"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    sequence_number = counter_doc.get("seq", 1)
    return f"EXP-{sequence_number:04d}"

async def get_current_funds() -> float:
    funds_doc = await system_col.find_one({"_id": "total_funds"})
    return funds_doc.get("amount", 0.0) if funds_doc else 0.0
