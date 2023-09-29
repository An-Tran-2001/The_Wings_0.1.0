import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
export interface IRootState {
  auth: any;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
