import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import AuthReducer from "../features/AuthFeature/State/AuthSlice";
import UserReducer from "../features/UserFeature/State/UserSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: AuthReducer,
    users: UserReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
