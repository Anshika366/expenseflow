from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import re as _re

class UserSignupModel(BaseModel):
    name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)

class UserLoginModel(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)

class UpdatePasswordModel(BaseModel):
    email: str = Field(min_length=3)
    new_password: str = Field(min_length=6)

class UserResponseModel(BaseModel):
    id: str
    name: str
    email: str

class TokenResponseModel(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseModel

_DATE_PATTERN = _re.compile(r"^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")

class ExpenseModel(BaseModel):
    id: str = Field(description="Unique custom generated ID, e.g. EXP-0001")
    name: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str
    date: str
    payment_method: str
    description: Optional[str] = Field(default=None, max_length=200)
    # user_id is optional so existing records without it remain valid
    user_id: Optional[str] = Field(default=None)

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        if not _DATE_PATTERN.match(v):
            raise ValueError(
                "date must be in YYYY-MM-DD format with a valid month (01-12) and day (01-31)."
            )
        try:
            from datetime import datetime
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"'{v}' is not a valid calendar date.")
        return v

class EditExpenseModel(BaseModel):
    name: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str
    date: str
    payment_method: str
    description: Optional[str] = Field(default=None, max_length=200)

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        if not _DATE_PATTERN.match(v):
            raise ValueError(
                "date must be in YYYY-MM-DD format with a valid month (01-12) and day (01-31)."
            )
        try:
            from datetime import datetime
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"'{v}' is not a valid calendar date.")
        return v

class AppStateResponse(BaseModel):
    total_funds: float
    expenses: List[ExpenseModel]

class SettingsImportModel(BaseModel):
    version: Optional[str] = "1.0"
    exportedAt: Optional[str] = None
    funds: Optional[float] = None
    total_funds: Optional[float] = None
    expenses: List[ExpenseModel] = []

class ImportSummaryResponseModel(BaseModel):
    message: str = "Data imported successfully!"
    imported: int
    duplicates: int
    skipped: int

class TrendItemModel(BaseModel):
    percentage: Optional[float] = None
    direction: str = "neutral"
    label: str = ""
    text: str = ""
    sparkline: List[float] = []

class DashboardTrendsModel(BaseModel):
    funds: TrendItemModel
    expenses: TrendItemModel
    balance: TrendItemModel
    today: TrendItemModel
    transactions: TrendItemModel

class DashboardResponseModel(BaseModel):
    total_funds: float
    total_expenses: float
    remaining_balance: float
    today_spending: float
    total_transactions: int
    recent_expenses: List[ExpenseModel]
    trends: Optional[DashboardTrendsModel] = None

class CategorySummaryModel(BaseModel):
    category: str
    amount: float
    percentage: float

class MonthlySummaryModel(BaseModel):
    month: str
    amount: float
    transaction_count: int = 0
    avg_amount: float = 0.0

class ReportResponseModel(BaseModel):
    highest_expense: Optional[ExpenseModel] = None
    lowest_expense: Optional[ExpenseModel] = None
    average_expense: float = 0.0
    category_summary: List[CategorySummaryModel] = []
    monthly_summary: List[MonthlySummaryModel] = []
    weekly_summary: List[MonthlySummaryModel] = []

class PaginatedExpensesResponse(BaseModel):
    items: List[ExpenseModel]
    total: int
    page: int
    page_size: int
    total_pages: int
