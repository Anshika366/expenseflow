import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

def get_mongo_details() -> str:
    return (
        os.getenv("MONGO_DETAILS") or
        os.getenv("MONGODB_URI") or
        os.getenv("MONGO_URI") or
        os.getenv("DATABASE_URL") or
        "mongodb://127.0.0.1:27017"
    )

MONGO_DETAILS = get_mongo_details()

class ClientProxy:
    def __init__(self):
        self._client = None
        self._loop = None
        self._uri = None

    def _get_client(self):
        uri = get_mongo_details()
        try:
            curr_loop = asyncio.get_running_loop()
        except RuntimeError:
            curr_loop = None

        if (
            self._client is None
            or self._uri != uri
            or (curr_loop and curr_loop != self._loop)
            or (self._loop and self._loop.is_closed())
        ):
            self._client = AsyncIOMotorClient(uri)
            self._loop = curr_loop
            self._uri = uri
        return self._client

    def __getattr__(self, item):
        return getattr(self._get_client(), item)

    def __getitem__(self, item):
        return self._get_client()[item]

client = ClientProxy()

class DatabaseProxy:
    def __init__(self, db_name="expenseflow"):
        self._db_name = db_name

    def _get_db(self):
        return client[self._db_name]

    def __getattr__(self, item):
        return getattr(self._get_db(), item)

    def __getitem__(self, item):
        return self._get_db()[item]

db = DatabaseProxy("expenseflow")

class CollectionProxy:
    def __init__(self, name: str):
        self._name = name

    def _get_col(self):
        return db[self._name]

    def __getattr__(self, item):
        return getattr(self._get_col(), item)

    def __getitem__(self, item):
        return self._get_col()[item]

expenses_col = CollectionProxy("expenses")
system_col = CollectionProxy("system")
users_col = CollectionProxy("users")
budgets_col = CollectionProxy("budgets")
