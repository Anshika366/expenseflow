# ExpenseFlow 💸

ExpenseFlow is a modern full-stack personal expense management system built with **React.js**, **FastAPI**, **MongoDB**, and **Tailwind CSS**. It helps users manage funds, record daily expenses, track spending, and analyze financial data through a clean and responsive dashboard.

## Features

- **Dashboard**: Real-time financial overview with interactive charts and KPI metrics.
- **Fund Management**: Add and track total wallet funds with live balance calculation.
- **Expense Tracking**: Add, edit, and delete daily expenses with category tags.
- **Expense History**: Search, filter, and sort past transactions.
- **Reports & Analytics**: Category-wise, weekly, monthly, and custom range analytics with CSV export.
- **Budget Goals**: Set category budget limits and receive visual spending alerts.
- **User Authentication**: Secure JWT-based registration and login system.
- **Light & Dark Mode**: Smooth theme toggling for enhanced user experience.
- **Export & Import Data**: Easily backup and restore your financial data.
- **Fully Responsive**: Optimized UI for desktop, tablet, and mobile screens.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend UI Framework |
| Tailwind CSS | Modern Styling & Design System |
| React Router | Client-side Routing |
| Recharts | Interactive Data Charts |
| Axios | HTTP API Client |
| Python | Backend Runtime |
| FastAPI | High-Performance REST API |
| Motor (MongoDB) | Asynchronous Database Driver |

## Project Structure

```text
expenseflow/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vercel.json
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   ├── Procfile
│   └── requirements.txt
└── README.md
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Anshika366/expenseflow.git
cd expenseflow
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5174** (or **http://localhost:5173**)

### Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_DETAILS=mongodb://127.0.0.1:27017
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

Backend API runs at **http://localhost:8000**

FastAPI API documentation is available at **http://localhost:8000/docs**

## Live Demo

- **Frontend Application:** https://expenseflow-flax.vercel.app/


## Future Improvements

- Recurring automated subscription expenses
- OCR Receipt scanning and automatic parsing
- Multi-currency support
- Cloud synchronization and multi-device push notifications

## Repository

GitHub: **https://github.com/Anshika366/expenseflow**
