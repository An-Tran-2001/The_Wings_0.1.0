import { configureStore } from "@reduxjs/toolkit";
import AuthReducer, { AuthState } from "./auth/reducer";
import MessageReducer,{ messageState }  from "./message/reducer";
import PostReducer, { postState } from "./post/reducer";
import ProfileReducer, { ProfileState } from "./profile/reducer";
import FriendReducer, { friendState } from "./friend/reducer";
import MyPicsReducer, { MyPicsState } from "./mypics/reducer";
export interface IRootState {
  auth: AuthState;
  message: messageState;
  post: postState;
  profile: ProfileState;
  friends: friendState;
  my_pics: MyPicsState;
}

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    message: MessageReducer,
    post: PostReducer,
    profile: ProfileReducer,
    friends: FriendReducer,
    myPics: MyPicsReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
