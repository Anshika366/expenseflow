# ExpenseFlow 💸

ExpenseFlow is a modern, production-ready personal expense management system built with **React.js (Vite)**, **FastAPI**, **MongoDB (Motor)**, and **Tailwind CSS**. It enables authenticated users to manage wallet funds, record daily expenses, track spending trends, analyze financial reports with month-over-month charts, set budget thresholds, and safely export/import backups.

---

## 🌟 Key Features

- **Dashboard**: Real-time financial overview with 5 KPI cards, wallet balance calculation, and **exactly 3 recent transactions**.
- **Fund Management**: Add funds with validation and live user-scoped balance calculations.
- **Expense CRUD**: Add, view, edit, and delete expenses with auto-generated sequential IDs (`EXP-0001`), strict date validation (`YYYY-MM-DD`), and descriptions.
- **Expense History**: Full search, category/payment/date/amount filtering, table sorting, description tooltips, and actions.
- **Reports & Analytics**:
  - Category breakdown with proportional percentages
  - Real month-over-month spending bar chart across calendar months
  - Monthly summary table (Month & Year, Total Amount, Transaction Count, Average Transaction)
  - Printable financial statement and CSV statement export
- **Budget Limits**: Set category-specific budget goals with real-time visual progress and alert badges.
- **User Authentication & Security**:
  - Secure JWT authentication with user data isolation
  - Startup migration ensuring legacy unassigned data is safely owned
  - Production fail-safe: refuses to start without a valid `JWT_SECRET`
  - CORS strictly configured to permitted origins
  - Security response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- **Settings & Data Management**:
  - Theme toggle (Light / Dark mode) with persistence
  - Full system JSON export and backup snapshot
  - JSON and CSV data import with duplicate detection
  - Confirmed Delete All scoped strictly to the authenticated user
- **Automated Test Suite**: Comprehensive pytest suite (43 automated tests) covering security, auth, CRUD, pagination, filtering, reports, and funds.
- **Docker & CI/CD**: Dockerfiles, Docker Compose, and GitHub Actions CI workflow for automated testing and builds.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React 19 + Vite | Fast modern single-page frontend application |
| Styling | Tailwind CSS 4 | Glassmorphism, animations, responsive design |
| Routing | React Router 7 | Client-side routing with authenticated protected routes |
| Charts | Recharts | Visual data representation |
| HTTP Client | Axios | Backend REST API integration with auth interceptors |
| Backend | FastAPI | High-performance asynchronous Python API |
| Database | MongoDB + Motor | Asynchronous MongoDB driver with connection proxies |
| Auth & Security | PyJWT + Passlib (bcrypt) | Token generation, verification, and password hashing |
| Validation | Pydantic v2 | Request/response schema and calendar date validation |
| Testing | pytest + pytest-asyncio | Automated backend integration test suite |
| Containerization | Docker + Docker Compose | Container deployment for database, API, and client |
| CI/CD | GitHub Actions | Automated lint, build, and test pipeline |

---

## 📁 Project Structure

```text
expenseflow/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI workflow
├── docker-compose.yml             # Multi-container local orchestration
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py            # Signup, login, profile, password reset
│   │   │   ├── dashboard.py       # Metrics, trends, recent transactions (max 3)
│   │   │   ├── expenses.py        # CRUD, filters (?category, ?date), pagination
│   │   │   ├── funds.py           # Add funds, get user total funds
│   │   │   ├── reports.py         # Analytics, /monthly, /category endpoints
│   │   │   ├── settings.py        # Export, backup, import, delete all
│   │   │   └── budgets.py         # Category budgets management
│   │   ├── services/
│   │   │   ├── analytics.py       # Month/category aggregation calculations
│   │   │   └── export.py          # Data import/export and duplicate detection
│   │   ├── database.py            # MongoDB connection & loop-aware collection proxies
│   │   ├── main.py                # FastAPI entrypoint, CORS, security, startup migration
│   │   ├── schemas.py             # Pydantic schemas & date validation
│   │   └── security.py            # Password hashing, JWT verification, user dependencies
│   ├── tests/
│   │   └── test_api.py            # 43 automated integration and security tests
│   ├── pytest.ini                 # Pytest configuration
│   ├── Dockerfile                 # Backend container definition
│   ├── requirements.txt           # Python backend dependencies
│   └── .env.example               # Backend environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/            # Sidebar, ProtectedRoute, ChartsSection, etc.
│   │   ├── context/               # AppContext (user, state, expenses, theme)
│   │   ├── pages/                 # Dashboard, AddExpense, History, Reports, Settings, etc.
│   │   ├── services/              # Axios api client with JWT interceptors
│   │   ├── App.jsx                # Layout, routes, dark mode management
│   │   ├── index.css              # Custom styling, scrollbars, animations
│   │   └── main.jsx               # React DOM root and Toast provider
│   ├── nginx.conf                 # Nginx configuration for production frontend container
│   ├── Dockerfile                 # Frontend multi-stage build container
│   ├── package.json               # Node.js dependencies and build scripts
│   └── .env.example               # Frontend environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18 and **npm** >= 9
- **Python** >= 3.10
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas connection URI)
- *(Optional)* **Docker & Docker Compose**

### 1. Clone the Repository

```bash
git clone https://github.com/Anshika366/expenseflow.git
cd expenseflow
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the environment:
- **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
- **Linux / macOS:** `source venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

Create your `.env` file (copied from `.env.example`):
```bash
cp .env.example .env
```

Example configuration (`backend/.env`):
```env
MONGO_DETAILS=mongodb://127.0.0.1:27017
JWT_SECRET=your-secure-random-jwt-key-minimum-32-chars
JWT_ALGORITHM=HS256
ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,https://expenseflow-flax.vercel.app
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

### 3. Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` (or `http://localhost:5174`).

---

## 🧪 Running Automated Tests

ExpenseFlow includes a comprehensive 43-test suite in `backend/tests/test_api.py` covering:
- Authentication & protected routes (missing token, invalid token, login failures)
- Cross-user data isolation (User B cannot see, edit, or delete User A's expenses)
- Expense CRUD operations, auto-ID generation, impossible date validation (`2026-02-31`)
- API-level filtering (`?category=Food`, `?date=2026-10-01`, `?date_from=...&date_to=...`)
- Pagination with validation (`?page=1&page_size=50`, page size limit)
- Month-over-month and category reporting aggregation correctness
- Funds, JSON export/backup, JSON/CSV import, and duplicate detection
- Dashboard metric verification and max-3 recent transaction limit

To run the test suite:
```bash
cd backend
python -m pytest -v
```

To run frontend tests, linting, and production bundle verification:
```bash
cd frontend
npm run lint
npm run build
```

---

## 🐳 Docker & Docker Compose Setup

Run the complete full-stack environment (MongoDB + Backend + Frontend) with a single command:

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
- MongoDB: `localhost:27017`

---

## 📡 API Endpoint Reference

All endpoints except `/api/auth/signup` and `/api/auth/login` require an `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/api/auth/signup` | Register a new user | `201 Created` |
| `POST` | `/api/auth/login` | Login and receive JWT access token | `200 OK` |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile | `200 OK` |
| `POST` | `/api/auth/reset-password` | Reset account password | `200 OK` |

### Expenses (`/api/expenses`)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| `GET`  | `/api/expenses` | List expenses (with filters & pagination) | `200 OK` |
| `GET`  | `/api/expenses/next-id` | Get next sequential ID (`EXP-0001`) | `200 OK` |
| `GET`  | `/api/expenses/{id}` | Get single expense by ID | `200 OK` / `404` |
| `POST` | `/api/expenses` | Create a new expense | `201 Created` |
| `PUT`  | `/api/expenses/{id}` | Update an existing expense | `200 OK` / `404` |
| `DELETE` | `/api/expenses/{id}` | Delete an expense | `200 OK` / `404` |

#### Query Parameters for `GET /api/expenses`:
- `category` *(string, optional)*: Filter by exact category (case-insensitive, e.g. `?category=Food`)
- `date` *(string, optional)*: Filter by exact date in `YYYY-MM-DD` format (e.g. `?date=2026-10-13`)
- `date_from` *(string, optional)*: Filter expenses on or after this date (e.g. `?date_from=2026-10-01`)
- `date_to` *(string, optional)*: Filter expenses on or before this date (e.g. `?date_to=2026-10-31`)
- `sort` *(string, optional)*: Sort field: `date` \| `amount` \| `name`
- `order` *(string, optional)*: Sort direction: `asc` \| `desc` (default: `desc`)
- `page` *(int, optional, default: 1)*: 1-indexed page number
- `page_size` *(int, optional, default: 50, max: 200)*: Items per page

Response schema:
```json
{
  "items": [ ... ],
  "total": 42,
  "page": 1,
  "page_size": 50,
  "total_pages": 1
}
```

### Dashboard & Analytics (`/api/dashboard`, `/api/reports`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/dashboard` | KPI metrics, trends, and max 3 recent transactions |
| `GET`  | `/api/data` | Complete app state for authenticated user |
| `GET`  | `/api/reports` | Combined category, monthly, and weekly analytics |
| `GET`  | `/api/reports/monthly` | Month-by-month spending summaries |
| `GET`  | `/api/reports/category` | Category-wise expense aggregation |

### Funds (`/api/funds`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/funds/total` | Get authenticated user's total wallet funds |
| `POST` | `/api/funds?amount=X` | Deposit funds into authenticated user's wallet |

### Settings & Backup (`/api/settings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/settings/export` | Export financial records as downloadable JSON |
| `GET`  | `/api/settings/backup` | Create full system snapshot backup JSON |
| `POST` | `/api/settings/import` | Import backup records with duplicate detection |
| `DELETE` | `/api/settings/delete-all` | Purge all expense records for authenticated user |

---

## 🔒 Security Configuration

1. **Authentication Token Requirement**: Protected routes strictly require a valid JWT signed with the secret key. Demo bypass tokens have been completely removed.
2. **User Data Isolation**: Every MongoDB operation is scoped to the user ID extracted from the verified JWT. Cross-user read/write attempts are denied.
3. **Fail-Safe Startup**: In production environments (`ENV=production`), the application terminates immediately if `JWT_SECRET` is not set.
4. **CORS Control**: Wildcard CORS origins are forbidden when credentials are enabled. Origins must be specified in the `ALLOWED_ORIGINS` environment variable.
5. **Safe Data Migration**: On application startup, any existing unowned legacy records are assigned to the primary account rather than being shared across multiple users or discarded.

---

## 🌐 Deployment Notes

- **Frontend Deployment (Vercel)**: Configured via `frontend/vercel.json`. Set `VITE_API_URL` to your production backend URL (e.g. `https://your-backend.onrender.com/api`).
- **Backend Deployment**: Ensure `MONGO_DETAILS`, `JWT_SECRET`, and `ALLOWED_ORIGINS` are defined in your cloud hosting provider (Render, Railway, AWS, etc.).

---

## 👤 Author & Repository

- **Repository:** [https://github.com/Anshika366/expenseflow](https://github.com/Anshika366/expenseflow)
- **Live Frontend:** [https://expenseflow-flax.vercel.app](https://expenseflow-flax.vercel.app)
