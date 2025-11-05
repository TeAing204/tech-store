import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

const initialState = {
  categories: [],
  pagination: {},
  isLoading: false,
  errorMessage: null,
};

// Lấy danh sách
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ params } = {}, { rejectWithValue }) => {
    try {
      return await categoryService.fetchCategories(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thêm danh mục
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async ({ categoryName, description }, { rejectWithValue }) => {
    try {
      return await categoryService.addCategory({ categoryName, description });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Xoá danh mục
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryIds, { rejectWithValue }) => {
    try {
      return await categoryService.deleteCategory(categoryIds);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cập nhật trạng thái
export const updateCategoryStatus = createAsyncThunk(
  "categories/updateCategoryStatus",
  async ({ categoryId, status }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategoryStatus({ categoryId, status });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Sửa danh mục
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, categories }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory({ categoryId, categories });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // Add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => !action.payload.includes(category.categoryId)
        );
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.categories.findIndex(
          (cat) => cat.categoryId === updated.categoryId
        );
        if (index !== -1) state.categories[index] = updated;
      })

      // Update Status
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (u) => u.categoryId === updatedCategory.categoryId
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      });
  },
});

export const categoryReducer = categorySlice.reducer;
