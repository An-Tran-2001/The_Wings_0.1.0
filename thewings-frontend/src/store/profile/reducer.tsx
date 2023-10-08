import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enum";
import { TOKEN_KEY, AN_ERROR_TRY_AGAIN } from "constant/path";
import { User } from "store/auth";
import { getProfile } from "./actions";
import { acceptRequest, addFriend, removeFriend } from "store/friend/actions";

export interface ProfileState {
  user?: User;
  status: DataStatus;
  error: string | null;
}

const initialState: ProfileState = {
  status: DataStatus.IDLE,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
        state.user = undefined;
        state.status = DataStatus.IDLE;
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = DataStatus.SUCCESS;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(addFriend.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(removeFriend.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(acceptRequest.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.payload as string;
      });
  }
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;