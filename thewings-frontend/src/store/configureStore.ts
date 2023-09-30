import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
import MessageReducer,{ messageState }  from "./message/reducer";
export interface IRootState {
  auth: AuthState;
  message: messageState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    message: MessageReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
