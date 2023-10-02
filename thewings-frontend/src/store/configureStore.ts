import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
import MessageReducer,{ messageState }  from "./message/reducer";
import PostReducer, { postState } from "./post/reducer";
import ProfileReducer, { ProfileState } from "./profile/reducer";
export interface IRootState {
  auth: AuthState;
  message: messageState;
  post: postState;
  profile: ProfileState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    message: MessageReducer,
    post: PostReducer,
    profile: ProfileReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
