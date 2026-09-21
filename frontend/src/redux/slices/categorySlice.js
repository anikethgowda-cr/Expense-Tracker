import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories", { params });
      return response.data.data.categories;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response.data.data.category;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data.data.category;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
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
  categories: [],
  loading: false,
  error: null
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  }
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer;
