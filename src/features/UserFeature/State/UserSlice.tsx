import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
// import { RootState } from '../store';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UserState {
  status: string;
  error: null | string;
  users: any;
}

// Define the initial state using the adapter
const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = userAdapter.getInitialState<UserState>({
  status: "idle",
  error: null,
  users: [],
});

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return users;
});

// Async thunk to fetch a single user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((user: User) => user.id === id);
    if (!user) throw new Error("User not found");
    return user;
  }
);

// Async thunk to create a new user
export const createUser = createAsyncThunk(
  "users/create",
  async (user: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u: User) => u.email === user.email);
    if (existingUser) throw new Error("User with email already exists");
    const newUser = { ...user, id: Math.random().toString() };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    return newUser;
  }
);

// Async thunk to update an existing user
export const updateUser = createAsyncThunk(
  "users/update",
  async (user: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: User) => u.id === user.id);
    if (index === -1) throw new Error("User not found");
    const updatedUser = { ...users[index], ...user };
    const updatedUsers = [
      ...users.slice(0, index),
      updatedUser,
      ...users.slice(index + 1),
    ];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    return updatedUser;
  }
);

// Async thunk to delete a user by ID
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: User) => u.id === id);
    if (index === -1) throw new Error("User not found");
    const deletedUser = users[index];
    const updatedUsers = [...users.slice(0, index), ...users.slice(index + 1)];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    return deletedUser;
  }
);

// Create the slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        userAdapter.upsertMany(state, action.payload);
        state.status = "succeeded";
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchUserById.fulfilled, (state, action) => {
        userAdapter.addOne(state, action.payload);
        state.status = "succeeded";
      })

      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createUser.fulfilled, (state, action) => {
        userAdapter.addOne(state, action.payload);
        state.status = "succeeded";
      })

      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        userAdapter.upsertOne(state, action.payload);
        state.status = "succeeded";
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        userAdapter.removeOne(state, action.payload.id);
        state.status = "succeeded";
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  userAdapter.getSelectors((state: any) => state.users);

export default userSlice.reducer;
