import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const userFromLocalStorage = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : { username: null, avatar: null, email: null, phoneNumber: null, token: null, roles: [] };

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
      );
    }
  }
);



export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.updateAccount(formData);
      const oldData = JSON.parse(localStorage.getItem("auth"));
      const mergedData = {
        ...oldData,
        username: data.username ?? oldData.username,
        email: data.email ?? oldData.email,
        phoneNumber: data.phoneNumber ?? oldData.phoneNumber,
      };
      localStorage.setItem("auth", JSON.stringify(mergedData));
      return mergedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Cập nhật tài khoản thất bại!"
      );
    }
  }
);

export const updateAccountImage = createAsyncThunk(
  "auth/updateAccountImage",
  async (imageFile, thunkAPI) => {
    try {
      const data = await authService.updateAccountImage(imageFile);
      const oldData = JSON.parse(localStorage.getItem("auth"));
      const mergedData = {
        ...oldData,
        avatar: data.avatar ?? oldData.avatar
      };
      localStorage.setItem("auth", JSON.stringify(mergedData));
      return mergedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserDetail = createAsyncThunk(
  "auth/getUserDetail",
  async (_, thunkAPI) => {
    try {
      const data = await authService.getUserDetail();
      const oldData = JSON.parse(localStorage.getItem("auth"));
      const mergedData = {
        ...oldData,
        username: data.username ?? oldData.username,
        email: data.email ?? oldData.email,
        avatar: data.avatar ?? oldData.avatar,
        phoneNumber: data.phoneNumber ?? oldData.phoneNumber,
      };
      localStorage.setItem("auth", JSON.stringify(mergedData));
      return mergedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (formData, thunkAPI) => {
    try {
      const data = await authService.updatePassword(formData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);



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
      })
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user, 
          ...action.payload, 
        };
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAccountImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user, 
          ...action.payload, 
        };
      })
      .addCase(updateAccountImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user, 
          ...action.payload
        };
      })
      .addCase(getUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
