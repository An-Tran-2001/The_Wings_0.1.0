import { DataStatus } from "@/constant/enum";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { login } from "/.actions";
import { AN_ERROR_TRY_AGAIN, TOKEN_KEY } from "@/constant";
import { User, UserResponse } from "./types";

export interface AuthState {
  user?: User;
  userStatus: DataStatus;
  userError?: string;

  token?: string;
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
      state.token = undefined;
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
          const { accessToken: token, user } = action.payload;
          state.user = user;
          state.token = token;
          state.userStatus = DataStatus.SUCCESS;
          state.userError = undefined;
          localStorage.setItem(TOKEN_KEY, token);
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.userStatus = DataStatus.FAILED;
        state.userError = action.error?.message || AN_ERROR_TRY_AGAIN;
      }),
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;