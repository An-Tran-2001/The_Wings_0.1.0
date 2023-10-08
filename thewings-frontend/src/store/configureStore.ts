import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
import MessageReducer,{ messageState }  from "./message/reducer";
import PostReducer, { postState } from "./post/reducer";
import ProfileReducer, { ProfileState } from "./profile/reducer";
import FriendReducer, { friendState } from "./friend/reducer";
export interface IRootState {
  auth: AuthState;
  message: messageState;
  post: postState;
  profile: ProfileState;
  freinds: friendState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    message: MessageReducer,
    post: PostReducer,
    profile: ProfileReducer,
    friends: FriendReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
