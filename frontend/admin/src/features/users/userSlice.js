import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "./userService";

const initialState = {
  users: [],
  selectedUser: null,
  trashUsers: [],
  addresses: [],
  pagination: {},
  trashPagination: {},
  isLoading: false,
  errorMessage: null,
  btnLoader: false,
};

// ---- Thunks ----
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ params } = {}, { rejectWithValue }) => {
    try {
      return await userService.fetchUsers(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, {rejectWithValue}) => {
    try {
      return await userService.fetchUserById(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
)

export const fetchTrashUsers = createAsyncThunk(
  "users/fetchTrashUsers",
  async ({ params } = {}, { rejectWithValue }) => {
    try {
      return await userService.fetchTrashUsers(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, user, image }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(userId, user, image);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUserImage = createAsyncThunk(
  "users/updateUserImage",
  async ({ userId, imageFile }, thunkAPI) => {
    try {
      return await userService.updateUserImage(userId, imageFile);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      return await userService.updateUserStatus(userId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const softDeleteUser = createAsyncThunk(
  "users/softDeleteUser",
  async ({ userIds }, { rejectWithValue }) => {
    try {
      return await userService.softDeleteUser(userIds);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ userIds }, { rejectWithValue }) => {
    try {
      return await userService.deleteUser(userIds);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const restoreUser = createAsyncThunk(
  "users/restoreUser",
  async ({ userIds }, { rejectWithValue }) => {
    try {
      return await userService.restoreUser(userIds);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ---- Slice ----
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // Update status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (u) => u.userId === updatedUser.userId
        );
        if (index !== -1) state.users[index] = updatedUser;
      })

      // Soft delete
      .addCase(softDeleteUser.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(softDeleteUser.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.users = state.users.filter(
          (user) => !action.payload.includes(user.userId)
        );
      })
      .addCase(softDeleteUser.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      })

      // Hard delete
      .addCase(deleteUser.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.trashUsers = state.trashUsers.filter(
          (user) => !action.payload.includes(user.userId)
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      })

      // Fetch trash users
      .addCase(fetchTrashUsers.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchTrashUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trashUsers = action.payload.content;
        state.trashPagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          lastPage: action.payload.lastPage,
        };
      })
      .addCase(fetchTrashUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      // Restore
      .addCase(restoreUser.pending, (state) => {
        state.btnLoader = true;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.btnLoader = false;
        state.trashUsers = state.trashUsers.filter(
          (user) => !action.payload.includes(user.userId)
        );
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.btnLoader = false;
        state.errorMessage = action.payload;
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.selectedUser = updatedUser;
        const index = state.users.findIndex(
          (u) => u.userId === updatedUser.userId
        );
        if (index !== -1) {
          state.users[index] = updatedUser; // Cập nhật trong danh sách
        }
      })

      // fetch User by UserId
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(updateUserImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedUser) {
          state.selectedUser.avatar = action.payload.avatar;
        }

      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const userReducer = userSlice.reducer;
