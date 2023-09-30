import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { searchUser } from "./actions";
import { User } from "store/auth";
import { DataStatus } from "constant/enum";
import { AN_ERROR_TRY_AGAIN } from "constant";

export interface messageState {
  users: User[];
  userStatus: DataStatus;
  userError?: string;
}

const initialState: messageState = {
  users: [],
  userStatus: DataStatus.IDLE,
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(searchUser.pending, (state) => {
        state.userStatus = DataStatus.LOADING;
      })
      .addCase(
        searchUser.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          const users  = action.payload;
          state.users = users;
        },
      )
      .addCase(searchUser.rejected, (state, action) => {
        state.userStatus = DataStatus.FAILED;
        state.userError = action.error?.message || AN_ERROR_TRY_AGAIN;
      });
  },
});

export default messageSlice.reducer;