from datetime import datetime
from fastapi import HTTPException
from app.database import expenses_col, system_col
from app.schemas import SettingsImportModel

async def generate_export_data() -> dict:
    funds_doc = await system_col.find_one({"_id": "total_funds"})
    total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0
    
    expenses_cursor = expenses_col.find()
    expenses = []
    async for exp in expenses_cursor:
        exp.pop("_id", None)
        expenses.append(exp)
        
    return {
        "version": "1.0",
        "exportedAt": datetime.utcnow().isoformat() + "Z",
        "funds": total_funds,
        "expenses": expenses
    }

async def generate_backup_data() -> dict:
    funds_doc = await system_col.find_one({"_id": "total_funds"})
    total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0
    
    expenses_cursor = expenses_col.find()
    expenses = []
    async for exp in expenses_cursor:
        exp.pop("_id", None)
        expenses.append(exp)
        
    return {
        "type": "backup",
        "version": "1.0",
        "backupAt": datetime.utcnow().isoformat() + "Z",
        "funds": total_funds,
        "expenses": expenses
    }

async def process_import_data(payload: SettingsImportModel) -> dict:
    if payload.version and not str(payload.version).startswith("1."):
        raise HTTPException(status_code=400, detail=f"Unsupported import version: {payload.version}")
        
    import_funds = payload.funds if payload.funds is not None else payload.total_funds
    if import_funds is not None and import_funds < 0:
        raise HTTPException(status_code=400, detail="Import funds amount cannot be negative.")
        
    existing_ids = set()
    async for doc in expenses_col.find({}, {"id": 1}):
        if "id" in doc:
            existing_ids.add(doc["id"])
            
    seen_ids = set()
    to_insert = []
    duplicate_count = 0
    skipped_count = 0

    for exp in payload.expenses:
        exp_id = exp.id
        if not exp_id or exp_id in existing_ids or exp_id in seen_ids:
            duplicate_count += 1
        else:
            seen_ids.add(exp_id)
            to_insert.append(exp.model_dump())

    if import_funds is not None:
        await system_col.update_one(
            {"_id": "total_funds"},
            {"$set": {"amount": float(import_funds)}},
            upsert=True
        )

    if to_insert:
        await expenses_col.insert_many(to_insert)
        
        max_num = 0
        all_ids = existing_ids.union(seen_ids)
        for eid in all_ids:
            try:
                num_part = int(eid.split("-")[1])
                if num_part > max_num:
                    max_num = num_part
            except (IndexError, ValueError):
                pass
        if max_num > 0:
            await system_col.update_one(
                {"_id": "expense_id_counter"},
                {"$set": {"seq": max_num}},
                upsert=True
            )

    return {
        "message": "Data imported successfully!",
        "imported": len(to_insert),
        "duplicates": duplicate_count,
        "skipped": skipped_count
    }
