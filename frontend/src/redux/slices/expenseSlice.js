import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/expenses", { params });
      return response.data.data.expenses;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  "expenses/fetchSummary",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/expenses/summary", { params });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.post("/expenses", expenseData);
      return response.data.data.expense;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/expenses/${id}`, data);
      return response.data.data.expense;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expenses/${id}`);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  expenses: [],
  summary: null,
  loading: false,
  error: null
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    clearExpenseError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
      });
  }
});

export const { clearExpenseError } = expenseSlice.actions;

export default expenseSlice.reducer;
