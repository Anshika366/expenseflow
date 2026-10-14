import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

os.environ["MONGO_DETAILS"] = os.getenv("MONGO_TEST_URI", "mongodb://127.0.0.1:27017/expenseflow_test")
os.environ["ENV"] = "development"

from app.main import app

BASE = "http://test"


@pytest_asyncio.fixture(scope="module")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE) as c:
        yield c


@pytest_asyncio.fixture(scope="module")
async def auth_headers(client: AsyncClient):
    await client.post("/api/auth/signup", json={
        "name": "Test User",
        "email": "testuser@expenseflow.test",
        "password": "TestPass123!"
    })
    res = await client.post("/api/auth/login", json={
        "email": "testuser@expenseflow.test",
        "password": "TestPass123!"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="module")
async def auth_headers_b(client: AsyncClient):
    await client.post("/api/auth/signup", json={
        "name": "Other User",
        "email": "otheruser@expenseflow.test",
        "password": "OtherPass456!"
    })
    res = await client.post("/api/auth/login", json={
        "email": "otheruser@expenseflow.test",
        "password": "OtherPass456!"
    })
    assert res.status_code == 200
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture()
async def created_expense(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    payload = {
        "id": next_id,
        "name": "Test Lunch",
        "amount": 250.0,
        "category": "Food",
        "date": "2026-10-01",
        "payment_method": "UPI",
        "description": "Test expense for pytest"
    }
    r = await client.post("/api/expenses", json=payload, headers=auth_headers)
    assert r.status_code == 201, r.text
    yield r.json()
    await client.delete(f"/api/expenses/{next_id}", headers=auth_headers)



@pytest.mark.asyncio
async def test_signup_success(client: AsyncClient):
    res = await client.post("/api/auth/signup", json={
        "name": "Signup Test",
        "email": "signup_only@expenseflow.test",
        "password": "MyPass123!"
    })
    assert res.status_code in (201, 400)


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    res = await client.post("/api/auth/login", json={
        "email": "nobody@expenseflow.test",
        "password": "wrongpassword"
    })
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_protected_route_no_token(client: AsyncClient):
    res = await client.get("/api/expenses")
    assert res.status_code in (401, 403)


@pytest.mark.asyncio
async def test_protected_route_invalid_token(client: AsyncClient):
    res = await client.get("/api/expenses", headers={"Authorization": "Bearer invalid.token.here"})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/auth/me", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "testuser@expenseflow.test"



@pytest.mark.asyncio
async def test_create_expense_success(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    payload = {
        "id": next_id,
        "name": "Coffee",
        "amount": 80.0,
        "category": "Food",
        "date": "2026-10-05",
        "payment_method": "Cash",
    }
    r = await client.post("/api/expenses", json=payload, headers=auth_headers)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Coffee"
    await client.delete(f"/api/expenses/{next_id}", headers=auth_headers)


@pytest.mark.asyncio
async def test_create_expense_missing_name(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    r = await client.post("/api/expenses", json={
        "id": next_id, "name": "", "amount": 100.0,
        "category": "Food", "date": "2026-10-05", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_create_expense_zero_amount(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    r = await client.post("/api/expenses", json={
        "id": next_id, "name": "Zero", "amount": 0,
        "category": "Food", "date": "2026-10-05", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_create_expense_negative_amount(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    r = await client.post("/api/expenses", json={
        "id": next_id, "name": "Neg", "amount": -50,
        "category": "Food", "date": "2026-10-05", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_create_expense_invalid_date_format(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    r = await client.post("/api/expenses", json={
        "id": next_id, "name": "Bad date", "amount": 100,
        "category": "Food", "date": "not-a-date", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_create_expense_impossible_date(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/next-id", headers=auth_headers)
    next_id = res.json()["next_id"]
    r = await client.post("/api/expenses", json={
        "id": next_id, "name": "Bad date 2", "amount": 100,
        "category": "Food", "date": "2026-13-45", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_get_all_expenses(client: AsyncClient, auth_headers: dict, created_expense: dict):
    res = await client.get("/api/expenses", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_get_expense_by_id(client: AsyncClient, auth_headers: dict, created_expense: dict):
    exp_id = created_expense["id"]
    res = await client.get(f"/api/expenses/{exp_id}", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["id"] == exp_id


@pytest.mark.asyncio
async def test_get_nonexistent_expense(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses/EXP-9999", headers=auth_headers)
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_update_expense(client: AsyncClient, auth_headers: dict, created_expense: dict):
    exp_id = created_expense["id"]
    r = await client.put(f"/api/expenses/{exp_id}", json={
        "name": "Updated Lunch",
        "amount": 300.0,
        "category": "Food",
        "date": "2026-10-01",
        "payment_method": "Credit Card",
    }, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["name"] == "Updated Lunch"
    assert r.json()["amount"] == 300.0


@pytest.mark.asyncio
async def test_update_nonexistent_expense(client: AsyncClient, auth_headers: dict):
    r = await client.put("/api/expenses/EXP-9999", json={
        "name": "Ghost", "amount": 100, "category": "Food",
        "date": "2026-10-01", "payment_method": "UPI"
    }, headers=auth_headers)
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_expense(client: AsyncClient, auth_headers: dict):
    r = await client.delete("/api/expenses/EXP-9999", headers=auth_headers)
    assert r.status_code == 404



@pytest.mark.asyncio
async def test_filter_by_category(client: AsyncClient, auth_headers: dict, created_expense: dict):
    res = await client.get("/api/expenses?category=Food", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert item["category"].lower() == "food"


@pytest.mark.asyncio
async def test_filter_by_date(client: AsyncClient, auth_headers: dict, created_expense: dict):
    res = await client.get("/api/expenses?date=2026-10-01", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert item["date"] == "2026-10-01"


@pytest.mark.asyncio
async def test_filter_no_match(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?category=NonExistentCategory99", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["total"] == 0



@pytest.mark.asyncio
async def test_sort_by_amount_asc(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?sort=amount&order=asc", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    amounts = [i["amount"] for i in items]
    assert amounts == sorted(amounts)


@pytest.mark.asyncio
async def test_sort_by_date_desc(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?sort=date&order=desc", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    dates = [i["date"] for i in items]
    assert dates == sorted(dates, reverse=True)



@pytest.mark.asyncio
async def test_pagination_defaults(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?page=1&page_size=10", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_pages" in data
    assert len(data["items"]) <= 10


@pytest.mark.asyncio
async def test_pagination_invalid_page(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?page=0", headers=auth_headers)
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_pagination_page_size_too_large(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/expenses?page_size=9999", headers=auth_headers)
    assert res.status_code == 422



@pytest.mark.asyncio
async def test_cross_user_cannot_see_expenses(
    client: AsyncClient,
    auth_headers: dict,
    auth_headers_b: dict,
    created_expense: dict,
):
    exp_id = created_expense["id"]
    res = await client.get(f"/api/expenses/{exp_id}", headers=auth_headers_b)
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_cross_user_cannot_delete_expense(
    client: AsyncClient,
    auth_headers: dict,
    auth_headers_b: dict,
    created_expense: dict,
):
    exp_id = created_expense["id"]
    res = await client.delete(f"/api/expenses/{exp_id}", headers=auth_headers_b)
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_cross_user_cannot_update_expense(
    client: AsyncClient,
    auth_headers: dict,
    auth_headers_b: dict,
    created_expense: dict,
):
    exp_id = created_expense["id"]
    res = await client.put(f"/api/expenses/{exp_id}", json={
        "name": "Hijacked", "amount": 1, "category": "Food",
        "date": "2026-10-01", "payment_method": "UPI"
    }, headers=auth_headers_b)
    assert res.status_code == 404



@pytest.mark.asyncio
async def test_dashboard_returns_metrics(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/dashboard", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_funds" in data
    assert "total_expenses" in data
    assert "remaining_balance" in data
    assert "today_spending" in data
    assert "total_transactions" in data
    assert "recent_expenses" in data


@pytest.mark.asyncio
async def test_dashboard_recent_expenses_max_3(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/dashboard", headers=auth_headers)
    assert res.status_code == 200
    recent = res.json()["recent_expenses"]
    assert len(recent) <= 3, f"Dashboard returned {len(recent)} recent expenses, expected max 3"


@pytest.mark.asyncio
async def test_dashboard_no_token(client: AsyncClient):
    res = await client.get("/api/dashboard")
    assert res.status_code in (401, 403)



@pytest.mark.asyncio
async def test_reports_returns_analytics(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/reports", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "category_summary" in data
    assert "monthly_summary" in data
    assert "average_expense" in data


@pytest.mark.asyncio
async def test_reports_monthly_endpoint(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/reports/monthly", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "monthly_summary" in data


@pytest.mark.asyncio
async def test_reports_category_endpoint(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/reports/category", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "category_summary" in data


@pytest.mark.asyncio
async def test_reports_empty_dataset(client: AsyncClient, auth_headers_b: dict):
    res = await client.get("/api/reports", headers=auth_headers_b)
    assert res.status_code == 200
    data = res.json()
    assert data["category_summary"] == []
    assert data["monthly_summary"] == []
    assert data["average_expense"] == 0.0



@pytest.mark.asyncio
async def test_monthly_aggregation_correctness(client: AsyncClient, auth_headers: dict):
    test_month = "2025-04"
    existing = await client.get("/api/expenses", headers=auth_headers)
    if existing.status_code == 200:
        for item in existing.json().get("items", []):
            if item.get("date", "").startswith(test_month):
                await client.delete(f"/api/expenses/{item['id']}", headers=auth_headers)

    id1_res = await client.get("/api/expenses/next-id", headers=auth_headers)
    id1 = id1_res.json()["next_id"]
    await client.post("/api/expenses", json={
        "id": id1, "name": "M1", "amount": 100.0,
        "category": "Food", "date": f"{test_month}-10", "payment_method": "UPI"
    }, headers=auth_headers)

    id2_res = await client.get("/api/expenses/next-id", headers=auth_headers)
    id2 = id2_res.json()["next_id"]
    await client.post("/api/expenses", json={
        "id": id2, "name": "M2", "amount": 200.0,
        "category": "Bills", "date": f"{test_month}-20", "payment_method": "Cash"
    }, headers=auth_headers)

    try:
        res = await client.get("/api/reports/monthly", headers=auth_headers)
        assert res.status_code == 200
        summaries = res.json()["monthly_summary"]
        target = next((m for m in summaries if m["month"] == test_month), None)
        assert target is not None, f"{test_month} entry not found in monthly summary"
        assert target["transaction_count"] == 2
        assert abs(target["amount"] - 300.0) < 0.01
    finally:
        await client.delete(f"/api/expenses/{id1}", headers=auth_headers)
        await client.delete(f"/api/expenses/{id2}", headers=auth_headers)



@pytest.mark.asyncio
async def test_add_funds_success(client: AsyncClient, auth_headers: dict):
    res = await client.post("/api/funds?amount=500", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_funds"] > 0


@pytest.mark.asyncio
async def test_add_funds_zero_rejected(client: AsyncClient, auth_headers: dict):
    res = await client.post("/api/funds?amount=0", headers=auth_headers)
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_add_funds_negative_rejected(client: AsyncClient, auth_headers: dict):
    res = await client.post("/api/funds?amount=-100", headers=auth_headers)
    assert res.status_code == 400



@pytest.mark.asyncio
async def test_export_returns_json(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/settings/export", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "expenses" in data
    assert "funds" in data


@pytest.mark.asyncio
async def test_backup_returns_json(client: AsyncClient, auth_headers: dict):
    res = await client.get("/api/settings/backup", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data.get("type") == "backup"


@pytest.mark.asyncio
async def test_import_valid_data(client: AsyncClient, auth_headers: dict):
    id_res = await client.get("/api/expenses/next-id", headers=auth_headers)
    new_id = id_res.json()["next_id"]
    payload = {
        "version": "1.0",
        "funds": 1000.0,
        "expenses": [{
            "id": new_id,
            "name": "Imported Expense",
            "amount": 150.0,
            "category": "Shopping",
            "date": "2026-09-15",
            "payment_method": "UPI",
        }]
    }
    res = await client.post("/api/settings/import", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["imported"] == 1
    await client.delete(f"/api/expenses/{new_id}", headers=auth_headers)


@pytest.mark.asyncio
async def test_import_duplicate_detection(client: AsyncClient, auth_headers: dict, created_expense: dict):
    payload = {
        "version": "1.0",
        "expenses": [{
            "id": created_expense["id"],
            "name": "Duplicate",
            "amount": 50.0,
            "category": "Food",
            "date": "2026-10-01",
            "payment_method": "UPI",
        }]
    }
    res = await client.post("/api/settings/import", json=payload, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["duplicates"] == 1
    assert res.json()["imported"] == 0



@pytest.mark.asyncio
async def test_budgets_unauthenticated_rejected(client: AsyncClient):
    res = await client.get("/api/budgets")
    assert res.status_code in (401, 403)
    put_res = await client.put("/api/budgets", json={"Food": 5000})
    assert put_res.status_code in (401, 403)


@pytest.mark.asyncio
async def test_budgets_cross_user_isolation(
    client: AsyncClient,
    auth_headers: dict,
    auth_headers_b: dict,
):
    user_a_budgets = {"Food": 9999.0, "Shopping": 8888.0}
    res_a = await client.put("/api/budgets", json=user_a_budgets, headers=auth_headers)
    assert res_a.status_code == 200
    assert res_a.json()["Food"] == 9999.0

    res_b = await client.get("/api/budgets", headers=auth_headers_b)
    assert res_b.status_code == 200
    assert res_b.json().get("Food") != 9999.0

    user_b_budgets = {"Food": 1234.0, "Shopping": 5678.0}
    res_b_update = await client.put("/api/budgets", json=user_b_budgets, headers=auth_headers_b)
    assert res_b_update.status_code == 200
    assert res_b_update.json()["Food"] == 1234.0

    res_a_verify = await client.get("/api/budgets", headers=auth_headers)
    assert res_a_verify.status_code == 200
    assert res_a_verify.json()["Food"] == 9999.0

    await client.delete("/api/budgets", headers=auth_headers)
    await client.delete("/api/budgets", headers=auth_headers_b)

