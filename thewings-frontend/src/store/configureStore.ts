import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
import MessageReducer,{ messageState }  from "./message/reducer";
import PostReducer, { postState } from "./post/reducer";
export interface IRootState {
  auth: AuthState;
  message: messageState;
  post: postState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    message: MessageReducer,
    post: PostReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
