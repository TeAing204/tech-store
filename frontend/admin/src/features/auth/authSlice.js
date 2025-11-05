import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const userFromLocalStorage = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : { username: null, token: null, roles: [] };

const initialState = {
  user: userFromLocalStorage,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.login(formData);
      localStorage.setItem("auth", JSON.stringify(data));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Đăng nhập thất bại!"
      );
    }
  }
);

export const authRegister = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.register(formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Đăng ký thất bại!"
      )
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth");
      state.user = { username: null, token: null, roles: [] };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
