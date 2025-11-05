import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import brandService from "./brandService";

const initialState = {
  brands: [],
  pagination: {},
  isLoading: false,
  errorMessage: null,
};

// Lấy danh sách thương hiệu
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async ({ params } = {}, { rejectWithValue }) => {
    try {
      return await brandService.fetchBrands(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thêm thương hiệu
export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async ({ brandName, description }, { rejectWithValue }) => {
    try {
      return await brandService.addBrand({ brandName, description });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Xóa thương hiệu
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandIds, { rejectWithValue }) => {
    try {
      return await brandService.deleteBrand(brandIds);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cập nhật trạng thái
export const updateBrandStatus = createAsyncThunk(
  "brands/updateBrandStatus",
  async ({ brandId, status }, { rejectWithValue }) => {
    try {
      return await brandService.updateBrandStatus({ brandId, status });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Sửa thương hiệu
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ brandId, brands }, { rejectWithValue }) => {
    try {
      return await brandService.updateBrand({ brandId, brands });
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // Add
      .addCase(addBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })

      // Delete
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => !action.payload.includes(brand.brandId)
        );
      })

      // Update
      .addCase(updateBrand.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.brands.findIndex(
          (b) => b.brandId === updated.brandId
        );
        if (index !== -1) state.brands[index] = updated;
      })

      // Update status
      .addCase(updateBrandStatus.fulfilled, (state, action) => {
        const updatedBrand = action.payload;
        const index = state.brands.findIndex(
          (b) => b.brandId === updatedBrand.brandId
        );
        if (index !== -1) {
          state.brands[index] = updatedBrand;
        }
      });
  },
});

export const brandReducer = brandSlice.reducer;
