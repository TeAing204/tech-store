import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  products: [],
  trashProducts: [],
  pagination: {},
  isLoading: false,
  errorMessage: null,
  btnLoader: false,
};


// Fetch product list
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productService.fetchProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch trash products
export const fetchTrashProducts = createAsyncThunk(
  "products/fetchTrashProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productService.fetchTrashProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add new product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ categoryId, product, images }, { rejectWithValue }) => {
    try {
      const { data } = await productService.addProduct(categoryId, product, images);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, product, images }, { rejectWithValue }) => {
    try {
      const { data } = await productService.updateProduct(productId, product, images);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete product permanently
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ productIds }, { rejectWithValue }) => {
    const ids = Array.isArray(productIds) ? productIds : [productIds];
    try {
      await productService.deleteProducts(ids);
      return ids;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Soft delete (move to trash)
export const softDeleteProduct = createAsyncThunk(
  "products/softDeleteProduct",
  async ({ productIds }, { rejectWithValue }) => {
    const ids = Array.isArray(productIds) ? productIds : [productIds];
    try {
      await productService.softDeleteProducts(ids);
      return ids;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Restore product from trash
export const restoreProduct = createAsyncThunk(
  "products/restoreProduct",
  async ({ productIds }, { rejectWithValue }) => {
    const ids = Array.isArray(productIds) ? productIds : [productIds];
    try {
      await productService.restoreProducts(ids);
      return ids;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update product active status
export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ productId, isActive }, { rejectWithValue }) => {
    try {
      await productService.updateProductStatus(productId, isActive);
      return { productId, isActive };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ========== SLICE ==========

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setBtnLoader: (state, action) => {
      state.btnLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // fetchTrashProducts
      .addCase(fetchTrashProducts.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchTrashProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trashProducts = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchTrashProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p.productId === updatedProduct.productId
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        } else {
          state.products.push(updatedProduct);
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // update status
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const { productId, isActive } = action.payload;
        const product = state.products.find((p) => p.productId === productId);
        if (product) product.active = isActive;
      })

      // delete permanently
      .addCase(deleteProduct.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.trashProducts = state.trashProducts.filter(
          (p) => !action.payload.includes(p.productId)
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      })

      // soft delete
      .addCase(softDeleteProduct.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(softDeleteProduct.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.products = state.products.filter(
          (p) => !action.payload.includes(p.productId)
        );
      })
      .addCase(softDeleteProduct.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      })

      // restore
      .addCase(restoreProduct.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.trashProducts = state.trashProducts.filter(
          (p) => !action.payload.includes(p.productId)
        );
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setBtnLoader } = productSlice.actions;
export const productReducer = productSlice.reducer;
