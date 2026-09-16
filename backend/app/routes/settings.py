from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.database import expenses_col, system_col
from app.schemas import SettingsImportModel, ImportSummaryResponseModel
from app.services.export import generate_export_data, generate_backup_data, process_import_data

router = APIRouter(prefix="/api", tags=["settings"])

@router.get("/settings/export")
async def export_data():
    try:
        data = await generate_export_data()
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        headers = {
            "Content-Disposition": f'attachment; filename="expenseflow-backup-{today_str}.json"'
        }
        return JSONResponse(content=data, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.get("/settings/backup")
async def backup_data():
    try:
        data = await generate_backup_data()
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        headers = {
            "Content-Disposition": f'attachment; filename="expenseflow-full-backup-{today_str}.json"'
        }
        return JSONResponse(content=data, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.post("/settings/import", response_model=ImportSummaryResponseModel)
async def import_settings_data(payload: SettingsImportModel):
    if not isinstance(payload, SettingsImportModel):
        raise HTTPException(status_code=400, detail="Invalid JSON structure.")
    try:
        return await process_import_data(payload)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Import failed: {str(e)}")

@router.delete("/settings/delete-all")
async def delete_all_expenses():
    try:
        count = await expenses_col.count_documents({})
        await expenses_col.drop()
        await system_col.delete_one({"_id": "expense_id_counter"})
        return {
            "message": "All expenses deleted successfully.",
            "deletedCount": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete all failed: {str(e)}")

@router.post("/system/reset")
async def clear_database():
    try:
        count = await expenses_col.count_documents({})
        await expenses_col.drop()
        await system_col.delete_one({"_id": "expense_id_counter"})
        return {
            "message": "All expenses deleted successfully.",
            "deletedCount": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failure: {str(e)}")

@router.post("/system/import", response_model=ImportSummaryResponseModel)
async def import_data(payload: SettingsImportModel):
    try:
        return await process_import_data(payload)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed import process: {str(e)}")
