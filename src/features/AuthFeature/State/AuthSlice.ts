import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createDraftSafeSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  status: string;
  error: null | string;
  loggedInUser: null | User;
}

const usersAdapter = createEntityAdapter();

const getUsersFromStorage = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const setUsersToStorage = (payload: any) => {
  localStorage.setItem("users", JSON.stringify(payload));
};

const initialState = usersAdapter.getInitialState<AuthState>({
  status: "idle",
  error: null,
  loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")!) || null,
});

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    const users = getUsersFromStorage();
    const user = users.find(
      (u: User) => u.email === email && u.password === password
    );
    if (!user) {
      return thunkAPI.rejectWithValue("Invalid email or password");
    }

    localStorage.setItem("loggedInUser", user.id);
    return user;
  }
);

export const logout = createAsyncThunk("auth/logout", () => {
  localStorage.removeItem("loggedInUser");
});

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, name }: User, thunkAPI) => {
    if (!getUsersFromStorage()) {
      setUsersToStorage([]);
    }
    const users = getUsersFromStorage();
    const existingUser = users.find((u: User) => u.email === email);

    if (existingUser) {
      return thunkAPI.rejectWithValue("Email already exists");
    }

    const newUser = { id: Math.random().toString(), name, email, password };
    setUsersToStorage([...users, newUser]);
    localStorage.setItem("loggedInUser", newUser.id);
    return newUser;
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (
    { email, newPassword }: { email: string; newPassword: string },
    thunkAPI
  ) => {
    const users = getUsersFromStorage();
    const user = users.find((u: User) => u.email === email);

    if (!user) {
      return thunkAPI.rejectWithValue("Invalid email");
    }

    const updatedUser = { ...user, password: newPassword };
    const updatedUsers = users.map((u: User) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsersToStorage(updatedUsers);
    return updatedUser;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.loggedInUser = action.payload;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Login failed";
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.loggedInUser = null;
    });

    builder.addCase(register.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.loggedInUser = action.payload;
    });

    builder.addCase(register.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Register failed";
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Password Reset failed";
    });
  },
});

export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectLoggedInUser = createDraftSafeSelector(
  selectAuth,
  (state) => state.loggedInUser
);

export default authSlice.reducer;
