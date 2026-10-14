from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.database import expenses_col, system_col
from app.schemas import SettingsImportModel, ImportSummaryResponseModel, ExpenseModel
from app.services.export import process_import_data
from app.security import get_current_user

router = APIRouter(prefix="/api", tags=["settings"])

def _user_query(current_user: dict) -> dict:
    return {"user_id": str(current_user["_id"])}

def _funds_key(current_user: dict) -> str:
    return f"total_funds_{str(current_user['_id'])}"

@router.get("/settings/export")
async def export_data(current_user: dict = Depends(get_current_user)):
    try:
        funds_key = _funds_key(current_user)
        funds_doc = await system_col.find_one({"_id": funds_key})
        total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0

        query = _user_query(current_user)
        expenses_cursor = expenses_col.find(query)
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(exp)

        data = {
            "version": "1.0",
            "exportedAt": datetime.utcnow().isoformat() + "Z",
            "funds": total_funds,
            "expenses": expenses,
        }
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        headers = {
            "Content-Disposition": f'attachment; filename="expenseflow-export-{today_str}.json"'
        }
        return JSONResponse(content=data, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.get("/settings/backup")
async def backup_data(current_user: dict = Depends(get_current_user)):
    try:
        funds_key = _funds_key(current_user)
        funds_doc = await system_col.find_one({"_id": funds_key})
        total_funds = funds_doc.get("amount", 0.0) if funds_doc else 0.0

        query = _user_query(current_user)
        expenses_cursor = expenses_col.find(query)
        expenses = []
        async for exp in expenses_cursor:
            exp.pop("_id", None)
            expenses.append(exp)

        data = {
            "type": "backup",
            "version": "1.0",
            "backupAt": datetime.utcnow().isoformat() + "Z",
            "funds": total_funds,
            "expenses": expenses,
        }
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        headers = {
            "Content-Disposition": f'attachment; filename="expenseflow-full-backup-{today_str}.json"'
        }
        return JSONResponse(content=data, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.post("/settings/import", response_model=ImportSummaryResponseModel)
async def import_settings_data(
    payload: SettingsImportModel,
    current_user: dict = Depends(get_current_user),
):
    if not isinstance(payload, SettingsImportModel):
        raise HTTPException(status_code=400, detail="Invalid JSON structure.")
    try:
        return await process_import_data(payload, current_user=current_user)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")

@router.delete("/settings/delete-all")
async def delete_all_expenses(current_user: dict = Depends(get_current_user)):
    try:
        query = _user_query(current_user)
        count = await expenses_col.count_documents(query)
        result = await expenses_col.delete_many(query)
        return {
            "message": "All your expenses deleted successfully.",
            "deletedCount": result.deleted_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete all failed: {str(e)}")

@router.post("/system/reset")
async def clear_database(current_user: dict = Depends(get_current_user)):
    try:
        query = _user_query(current_user)
        count = await expenses_col.count_documents(query)
        result = await expenses_col.delete_many(query)
        return {
            "message": "All expenses deleted successfully.",
            "deletedCount": result.deleted_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failure: {str(e)}")

@router.post("/system/import", response_model=ImportSummaryResponseModel)
async def import_data(
    payload: SettingsImportModel,
    current_user: dict = Depends(get_current_user),
):
    try:
        return await process_import_data(payload, current_user=current_user)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed import process: {str(e)}")
