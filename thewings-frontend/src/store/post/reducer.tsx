import { LikeStatus, PostStatus } from "constant/enum";
import { createPost, getOrtherPosts, getPosts, getPostsHome, postLike } from "./actions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "store/auth";
import { DataStatus } from "constant/enum";
import { AN_ERROR_TRY_AGAIN } from "constant";

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

export interface File {
    file: string;
    name: string;
}
export interface FileStatus {
    count: number;
    data: File[];
}

export interface Tags {
    count: number;
    data: User[];
}

export interface Post {
    id?: number;
    url?: string;
    files?: FileStatus;
    content?: string;
    created_at?: string;
    status?: PostStatus;
    author?: User;
    tags?: Tags;
    likes?: Like;
    comments?: Comment;
}
export interface postState {
    post: Post[];
    postState: DataStatus;
    error: string | null;
}

const initialState: postState = {
    post: [],
    postState: DataStatus.IDLE,
    error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetState: (state) => {
      state.post = [];
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
    [getPosts.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getPosts.fulfilled.type]: (state, action: PayloadAction<Post>) => {
      state.postState = DataStatus.SUCCESS;
      state.post = action.payload;
    },
    [getPosts.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [getPostsHome.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getPostsHome.fulfilled.type]: (state, action: PayloadAction<Post>) => {
      state.postState = DataStatus.SUCCESS;
      state.post = action.payload;
    },
    [getPostsHome.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [getOrtherPosts.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getOrtherPosts.fulfilled.type]: (state, action: PayloadAction<Post>) => {
      state.postState = DataStatus.SUCCESS;
      state.post = action.payload;
    },
    [getOrtherPosts.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [postLike.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    // [postLike.fulfilled.type]: (state, action: PayloadAction<Post>) => {
    //     state.postState = DataStatus.SUCCESS;
    //     const likes = action.payload;
    //     state.post = state.post.map((post) => {
    //     if (post.id === likes.post) {
    //         return {
    //         ...post,
    //         likes: likes.likes,
    //         };
    //     }
    //     return post;
    //     }
    //     );
    // }
  },
});

export const { resetState } = postSlice.actions;
export default postSlice.reducer;