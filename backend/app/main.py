import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.expenses import router as expenses_router
from app.routes.funds import router as funds_router
from app.routes.reports import router as reports_router
from app.routes.settings import router as settings_router
from app.routes.budgets import router as budgets_router

app = FastAPI(
    title="ExpenseFlow API",
    description="Modular Full-Stack MongoDB-backed personal expense manager backend."
)

@app.on_event("startup")
async def startup_migration():
    from app.database import expenses_col, users_col, system_col
    try:
        await users_col.create_index("email")
        unowned_count = await expenses_col.count_documents(
            {"$or": [{"user_id": None}, {"user_id": {"$exists": False}}, {"user_id": ""}]}
        )
        if unowned_count > 0:
            primary_user = await users_col.find_one({})
            if primary_user:
                primary_uid = str(primary_user["_id"])
                await expenses_col.update_many(
                    {"$or": [{"user_id": None}, {"user_id": {"$exists": False}}, {"user_id": ""}]},
                    {"$set": {"user_id": primary_uid}}
                )
                legacy_funds = await system_col.find_one({"_id": "total_funds"})
                if legacy_funds:
                    await system_col.update_one(
                        {"_id": f"total_funds_{primary_uid}"},
                        {"$set": {"amount": legacy_funds.get("amount", 0.0)}},
                        upsert=True
                    )
                    await system_col.delete_one({"_id": "total_funds"})
    except Exception:
        pass

from fastapi.responses import JSONResponse

raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000,http://127.0.0.1:3000,https://expenseflow-flax.vercel.app"
)
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    req_origin = request.headers.get("origin", "")
    cors_origin = req_origin if req_origin in origins else ""
    resp_headers = {}
    if cors_origin:
        resp_headers["Access-Control-Allow-Origin"] = cors_origin
        resp_headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
        headers=resp_headers,
    )

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if request.url.path.startswith("/api/auth") or request.url.path.startswith("/api/dashboard"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {
        "status": "online",
        "message": "ExpenseFlow API Backend is Running Live!",
        "docs": "/docs"
    }

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(expenses_router)
app.include_router(funds_router)
app.include_router(reports_router)
app.include_router(settings_router)
app.include_router(budgets_router)

