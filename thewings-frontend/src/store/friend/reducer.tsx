import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enum";
import { User } from "store/auth";
import { getFriends, getRequests } from "./actions";

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
            .addCase(getFriends.fulfilled, (state, action: PayloadAction<getFriendResponse>) => {
                state.friendState = DataStatus.SUCCESS;
                state.friends = action.payload.friend;
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.friendState = DataStatus.FAILED;
                state.error = action.payload as string;
            })
            .addCase(getRequests.pending, (state) => {
                state.friendState = DataStatus.LOADING;
            })
            .addCase(getRequests.fulfilled, (state, action: PayloadAction<RequestResponse>) => {
                state.friendState = DataStatus.SUCCESS;
                state.request = action.payload.friend;
            })
            .addCase(getRequests.rejected, (state, action) => {
                state.friendState = DataStatus.FAILED;
                state.error = action.payload as string;
            });
    },
});

export const { resetFriend } = friendSlice.actions;
export default friendSlice.reducer;