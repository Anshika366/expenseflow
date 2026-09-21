import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api, { getBudgets, updateBudgets } from "../services/api";

const AppContext = createContext();

const initialToken = localStorage.getItem("token") || "demo-session-token-anshika";
const initialUserName = localStorage.getItem("userName") || "Anshika";

const defaultInitialExpenses = [
  { id: "1", title: "game", name: "game", amount: 223, category: "Entertainment", date: "2026-09-02", payment_method: "UPI" },
  { id: "2", title: "Team Lunch", name: "Team Lunch", amount: 123, category: "Food", date: "2026-09-02", payment_method: "UPI" },
];

const defaultCategoryBudgets = {
  Food: 4000,
  Shopping: 3000,
  Bills: 5000,
  Transport: 2000,
  Entertainment: 1500,
  Healthcare: 2500,
  Others: 1000,
};

const initialState = {
  user: { name: initialUserName, email: "anshika@example.com" },
  token: initialToken,
  expenses: defaultInitialExpenses,
  categoryBudgets: defaultCategoryBudgets,
  totalFunds: 6000,
  totalExpenses: 346,
  remainingBalance: 5654,
  todaySpending: 0,
  totalTransactions: 2,
  trends: null,
  isLoading: false,
};

function calculateMetrics(expenses, totalFunds) {
  const totalExp = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySp = expenses
    .filter((item) => (item.date || "").startsWith(todayStr))
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return {
    totalExpenses: totalExp,
    remainingBalance: totalFunds - totalExp,
    todaySpending: todaySp,
    totalTransactions: expenses.length,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER": {
      const token = action.token || localStorage.getItem("token") || state.token;
      return {
        ...state,
        user: action.payload,
        token,
      };
    }
    case "SET_DATA": {
      const expenses = action.payload.expenses || state.expenses;
      const totalFunds = action.payload.total_funds ?? state.totalFunds;
      const trends = action.payload.trends || state.trends;
      const categoryBudgets = action.payload.category_budgets || state.categoryBudgets;
      const metrics = calculateMetrics(expenses, totalFunds);
      return {
        ...state,
        expenses,
        totalFunds,
        trends,
        categoryBudgets,
        ...metrics,
      };
    }
    case "UPDATE_BUDGETS": {
      return {
        ...state,
        categoryBudgets: action.payload,
      };
    }
    case "ADD_FUNDS": {
      const newFunds = state.totalFunds + action.payload;
      const metrics = calculateMetrics(state.expenses, newFunds);
      return {
        ...state,
        totalFunds: newFunds,
        ...metrics,
      };
    }
    case "ADD_EXPENSE": {
      const updatedExpenses = [action.payload, ...state.expenses];
      const metrics = calculateMetrics(updatedExpenses, state.totalFunds);
      return {
        ...state,
        expenses: updatedExpenses,
        ...metrics,
      };
    }
    case "UPDATE_EXPENSE": {
      const updatedExpenses = state.expenses.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      const metrics = calculateMetrics(updatedExpenses, state.totalFunds);
      return {
        ...state,
        expenses: updatedExpenses,
        ...metrics,
      };
    }
    case "DELETE_EXPENSE": {
      const updatedExpenses = state.expenses.filter((item) => item.id !== action.payload);
      const metrics = calculateMetrics(updatedExpenses, state.totalFunds);
      return {
        ...state,
        expenses: updatedExpenses,
        ...metrics,
      };
    }
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("isAuthenticated");
      return {
        ...initialState,
        token: null,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchAppData = useCallback(async () => {
    try {
      const [dataRes, dashRes, budgetsRes] = await Promise.allSettled([
        api.get("/data"),
        api.get("/dashboard"),
        getBudgets(),
      ]);
      const data = dataRes.status === "fulfilled" ? dataRes.value.data : {};
      const dashboard = dashRes.status === "fulfilled" ? dashRes.value.data : {};
      const budgets = budgetsRes.status === "fulfilled" ? budgetsRes.value.data : null;
      dispatch({
        type: "SET_DATA",
        payload: {
          ...data,
          trends: dashboard.trends || null,
          category_budgets: budgets ? (budgets.category_budgets || budgets) : null,
        },
      });
    } catch (err) {
      console.error("Failed to load backend app data:", err);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token || !token.startsWith("eyJ")) {
      dispatch({
        type: "SET_USER",
        payload: { name: initialUserName, email: "anshika@example.com" },
        token: token || initialToken,
      });
      await fetchAppData();
      return;
    }

    try {
      const res = await api.get("/auth/me");
      dispatch({ type: "SET_USER", payload: res.data, token });
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("isAuthenticated", "true");
      await fetchAppData();
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      dispatch({
        type: "SET_USER",
        payload: { name: initialUserName, email: "anshika@example.com" },
        token: "demo-session-token-anshika",
      });
      await fetchAppData();
    }
  }, [fetchAppData]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const addFunds = async (amount) => {
    try {
      await api.post(`/funds?amount=${amount}`);
      dispatch({ type: "ADD_FUNDS", payload: amount });
      await fetchAppData();
    } catch (err) {
      console.error("Add funds failed:", err);
    }
  };

  const addExpense = async (expensePayload) => {
    try {
      let expenseId = expensePayload.id;
      if (!expenseId) {
        const nextIdRes = await api.get("/expenses/next-id");
        expenseId = nextIdRes.data.next_id;
      }
      const completeExpense = {
        ...expensePayload,
        id: expenseId,
      };

      const res = await api.post("/expenses", completeExpense);
      dispatch({ type: "ADD_EXPENSE", payload: res.data });
      await fetchAppData();
    } catch (err) {
      console.error("Add expense failed:", err);
    }
  };

  const updateExpense = async (id, expensePayload) => {
    try {
      const res = await api.put(`/expenses/${id}`, expensePayload);
      dispatch({ type: "UPDATE_EXPENSE", payload: { id, ...res.data } });
      await fetchAppData();
    } catch (err) {
      console.error("Update expense failed:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      dispatch({ type: "DELETE_EXPENSE", payload: id });
      await fetchAppData();
    } catch (err) {
      console.error("Delete expense failed:", err);
    }
  };

  const updateCategoryBudgets = async (newBudgets) => {
    try {
      const res = await updateBudgets(newBudgets);
      const updatedData = res.data ? (res.data.category_budgets || res.data) : newBudgets;
      dispatch({ type: "UPDATE_BUDGETS", payload: updatedData });
    } catch (err) {
      console.error("Update category budgets failed:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        fetchAppData,
        addFunds,
        addExpense,
        updateExpense,
        deleteExpense,
        updateCategoryBudgets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
