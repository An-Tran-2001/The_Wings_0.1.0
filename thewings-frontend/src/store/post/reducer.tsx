import { LikeStatus, PostStatus } from "constant/enum";
import { FilePayload, createPost } from "./actions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "store/auth";
import { DataStatus } from "constant/enum";
import { AN_ERROR_TRY_AGAIN } from "constant";

export interface DataFile {
    count: number;
    data: FilePayload[];
};

export interface DataLike {
    id: number,
    user: User,
    status: LikeStatus,
    created_at: string,
    updated_at: string,
}


export interface Like {
    count: number;
    recoment: DataLike[];
    data: DataLike[];
}

export interface DataComment {
    id: number,
    user: User,
    content: string,
    created_at: string,
    updated_at: string,
    likes: Like[],
    posts?: number,
    parent: DataComment, 
}

export interface Comment {
    count: number;
    recoment: DataComment[];
    data: DataComment[];
}

export interface Post {
    id?: number;
    url?: string;
    files?: File[];
    content?: string;
    created_at?: string;
    status?: PostStatus;
    author?: string;
    tags?: number[];
    likes?: Like[];
    comments?: Comment[];
}

export interface postState {
    post: Post;
    postState: DataStatus;
    error: string | null;
}

const initialState: postState = {
    post: {},
    postState: DataStatus.IDLE,
    error: null,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        resetState: (state) => {
            state.post = {};
            state.postState = DataStatus.IDLE;
            state.error = null;
        },
    },
    extraReducers: {
        [createPost.pending.type]: (state) => {
            state.postState = DataStatus.LOADING;
            state.error = null;
        },
        [createPost.fulfilled.type]: (state, action: PayloadAction<Post>) => {
            state.postState = DataStatus.SUCCESS;
            state.post = action.payload;
        },
        [createPost.rejected.type]: (state, action: PayloadAction<string>) => {
            state.postState = DataStatus.FAILED;
            state.error = action.payload;
        },
    },
});

export const { resetState } = postSlice.actions;
export default postSlice.reducer;