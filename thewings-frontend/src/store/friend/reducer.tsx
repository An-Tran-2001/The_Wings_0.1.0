import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enum";
import { User } from "store/auth";
import { blockUser, getBlockUser, getFriends, getRequests, unBlockUser } from "./actions";

export interface getFriendResponse {
    id: number;
    name: string;
    friend: User[];
}

export interface getFriendRequestResponse {
    id: number;
    created_at: string;
    friend: User[];
}
export interface RequestResponse extends Omit<getFriendResponse, "friend"> {
  friend: getFriendRequestResponse[];
}

export interface friendState {
    friends: User[];
    request?: getFriendRequestResponse[];
    block?: User[];
    friendState: DataStatus;
    error: string | null;
}

const initialState: friendState = {
    friends: [],
    friendState: DataStatus.IDLE,
    error: null,
};

interface responseBlock {
  black_friend: User[];
}

const friendSlice = createSlice({
    name: "friend",
    initialState,
    reducers: {
        resetFriend: (state) => {
            state.friends = [];
            state.friendState = DataStatus.IDLE;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(getFriends.pending, (state) => {
            state.friendState = DataStatus.LOADING;
          })
          .addCase(
            getFriends.fulfilled,
            (state, action: PayloadAction<getFriendResponse>) => {
              state.friendState = DataStatus.SUCCESS;
              state.friends = action.payload.friend;
            },
          )
          .addCase(getFriends.rejected, (state, action) => {
            state.friendState = DataStatus.FAILED;
            state.error = action.payload as string;
          })
          .addCase(getRequests.pending, (state) => {
            state.friendState = DataStatus.LOADING;
          })
          .addCase(
            getRequests.fulfilled,
            (state, action: PayloadAction<RequestResponse>) => {
              state.friendState = DataStatus.SUCCESS;
              state.request = action.payload.friend;
            },
          )
          .addCase(getRequests.rejected, (state, action) => {
            state.friendState = DataStatus.FAILED;
            state.error = action.payload as string;
          })
          .addCase(blockUser.pending, (state) => {
            state.friendState = DataStatus.LOADING;
          })
          .addCase(
            blockUser.fulfilled,
            (state, action: PayloadAction<User>) => {
              state.friendState = DataStatus.SUCCESS;
              state.block = [...state.block!, action.payload];
              state.friends = state.friends.filter(
                (item) => item.id !== action.payload.id,
              );
            },
          )
          .addCase(blockUser.rejected, (state, action) => {
            state.friendState = DataStatus.FAILED;
            state.error = action.payload as string;
          })
          .addCase(getBlockUser.pending, (state) => {
            state.friendState = DataStatus.LOADING;
          })
          .addCase(
            getBlockUser.fulfilled,
            (state, action: PayloadAction<responseBlock>) => {
              state.friendState = DataStatus.SUCCESS;
              state.block = action.payload.black_friend;
            },
          )
          .addCase(getBlockUser.rejected, (state, action) => {
            state.friendState = DataStatus.FAILED;
            state.error = action.payload as string;
          })
          .addCase(unBlockUser.pending, (state) => {
            state.friendState = DataStatus.LOADING;
          })
          .addCase(
            unBlockUser.fulfilled,
            (state, action: PayloadAction<User>) => {
              state.friendState = DataStatus.SUCCESS;
              state.block = state.block?.filter(
                (item) => item.id !== action.payload.id,
              );
            },
          )
          .addCase(unBlockUser.rejected, (state, action) => {
            state.friendState = DataStatus.FAILED;
            state.error = action.payload as string;
          });
    },
});

export const { resetFriend } = friendSlice.actions;
export default friendSlice.reducer;