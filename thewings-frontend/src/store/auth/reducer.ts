import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { login } from "./actions";
import { TOKEN_KEY, AN_ERROR_TRY_AGAIN } from "constant/path";
import { DataStatus } from "constant/enum";

export interface User {
  id: number;
  username: string;
  name: string;
  url: string;
  avatar: string;
}

export interface UserResponse {
  user: User;
  token: {
    refresh: string;
    access
    : string;
  }
}

export interface AuthState {
  user?: User;
  userStatus: DataStatus;
  userError?: string;

  refresh_token?: string;
  access_token?: string;
}

const initialState: AuthState = {
  userStatus: DataStatus.IDLE,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
      state.refresh_token = undefined;
      state.access_token = undefined;
      (state.userStatus = DataStatus.IDLE), localStorage.removeItem(TOKEN_KEY);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.pending, (state) => {
        state.userStatus = DataStatus.LOADING;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          const { token: token, user } = action.payload;
          state.user = user;
          state.access_token = token.access;
          state.refresh_token = token.refresh;
          state.userStatus = DataStatus.SUCCESS;
          state.userError = undefined;
          localStorage.setItem(TOKEN_KEY, token.access);
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.userStatus = DataStatus.FAILED;
        state.userError = action.error?.message || AN_ERROR_TRY_AGAIN;
      }),
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;