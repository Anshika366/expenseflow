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

raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000,http://127.0.0.1:3000"
)
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true" else origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/")
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

