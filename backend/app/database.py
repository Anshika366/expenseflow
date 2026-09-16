import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://127.0.0.1:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.expenseflow

expenses_col = db.expenses
system_col = db.system
users_col = db.users
budgets_col = db.budgets
