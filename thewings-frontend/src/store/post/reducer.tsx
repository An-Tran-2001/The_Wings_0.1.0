import { LikeStatus, PostStatus } from "constant/enum";
import { changePost, createPost, deleteComment, deletePost, getOrtherPosts, getPosts, getPostsHome, postComment, postLike } from "./actions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "store/auth";
import { DataStatus } from "constant/enum";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { PagePaginationResponse } from "store/interfaces";

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
  id: number;
  users: User;
  content: string;
  created_at: string;
  updated_at: string;
  likes: Like[];
  posts?: number;
  parent: DataComment;
}

export interface Comment {
    count: number;
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
    id: number;
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

export interface PostResponse extends PagePaginationResponse {
  results: Post[];
}

export interface postState {
    myPosts: PostResponse | undefined;
    homePosts: PostResponse | undefined;
    yourPosts: PostResponse | undefined;
    post: Post | undefined;
    postState: DataStatus;
    error: string | null;
}

const initialState: postState = {
    post: undefined,
    myPosts: undefined,
    homePosts: undefined,
    yourPosts: undefined,
    postState: DataStatus.IDLE,
    error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetState: (state) => {
      state.myPosts = undefined;
      state.homePosts = undefined;
      state.yourPosts = undefined;
      state.postState = DataStatus.IDLE;
      state.error = null;
    },
    viewPost: (state, action: PayloadAction<Post>) => {
      state.post = action.payload;
    },
    popPost: (state, action: PayloadAction<{id: number}>) => {
      if (state.myPosts && state.myPosts.results) {
      state.myPosts = {...state.myPosts, results: state.myPosts?.results.filter((post) => post.id !== action.payload.id)}
      }
      if (state.homePosts && state.homePosts.results) {
      state.homePosts = {...state.homePosts, results: state.homePosts?.results.filter((post) => post.id !== action.payload.id)}
      }
      if (state.yourPosts && state.yourPosts.results) {
      state.yourPosts = {...state.yourPosts, results: state.yourPosts?.results.filter((post) => post.id !== action.payload.id)}
      }
    },
    resetYourPosts: (state) => {
      state.yourPosts = undefined;
    },
    resetHomePosts: (state) => {
      state.homePosts = undefined;
    },
    resetMyPosts: (state) => {
      state.myPosts = undefined;
    },
  },
  extraReducers: {
    [createPost.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [createPost.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
      state.postState = DataStatus.SUCCESS;
      if (state.myPosts) {
        state.myPosts = {...state.myPosts, results: [action.payload.post, ...state.myPosts.results]}
      }
      if (state.homePosts) {
        state.homePosts = {...state.homePosts, results: [action.payload.post, ...state.homePosts.results]}
      }
      if (state.yourPosts) {
        state.yourPosts = {...state.yourPosts, results: [action.payload.post, ...state.yourPosts.results]}
      }
    },
    [createPost.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [getPosts.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getPosts.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
      state.postState = DataStatus.SUCCESS;
      if (state.myPosts) {
        state.myPosts = {...state.myPosts, results: [...state.myPosts.results, ...action.payload.results]}
      }
      else {
        state.myPosts = action.payload;
      }
    },
    [getPosts.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [getPostsHome.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getPostsHome.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
      state.postState = DataStatus.SUCCESS;
      if (state.homePosts) {
        state.homePosts = {...state.homePosts, results: [...state.homePosts.results, ...action.payload.results]}
      } else {
      state.homePosts = action.payload;
      }
    },
    [getPostsHome.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [getOrtherPosts.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [getOrtherPosts.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
      state.postState = DataStatus.SUCCESS;
      if (state.yourPosts) {
        state.yourPosts = {...state.yourPosts, results: [...state.yourPosts.results, ...action.payload.results]}
      } else {
      state.yourPosts = action.payload;
      }
    },
    [getOrtherPosts.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [postLike.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [postLike.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
        state.postState = DataStatus.SUCCESS;
        const id_post = action.payload.post.id
        state.post = action.payload.post
        const myPosts =
          state.myPosts &&
          state.myPosts.results &&
          state.myPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
        if (state.myPosts && state.myPosts.results) {
        state.myPosts.results = myPosts;
        }
        const homePosts =
          state.homePosts &&
          state.homePosts.results &&
          state.homePosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
        if (state.homePosts && state.homePosts.results) {
        state.homePosts.results = homePosts;
        }
        const yourPosts =
          state.yourPosts &&
          state.yourPosts.results &&
          state.yourPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
        if (state.yourPosts && state.yourPosts.results) {
        state.yourPosts.results = yourPosts;
        }
    },
    [postLike.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [postComment.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [postComment.fulfilled.type]: (state, action: PayloadAction<Post>) => {
        state.postState = DataStatus.SUCCESS;
        const id_post = action.payload.post.id
        const myPosts =
          state.myPosts &&
          state.myPosts.results &&
          state.myPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
        const homePosts =
          state.homePosts &&
          state.homePosts.results &&
          state.homePosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
        const yourPosts =
          state.yourPosts &&
          state.yourPosts.results &&
          state.yourPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload.post;
            }
            return post;
          });
          if (state.myPosts && state.myPosts.results) {
          state.myPosts.results = myPosts;
          }
          if (state.homePosts && state.homePosts.results) {
          state.homePosts.results = homePosts;
          }
          if (state.yourPosts && state.yourPosts.results) {
          state.yourPosts.results = yourPosts;
          }
          state.post.comments = action.payload.post.comments;
    
    },
    [postComment.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [deletePost.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [deletePost.fulfilled.type]: (state, action: PayloadAction<{id: number, response: any}>) => {
        state.postState = DataStatus.SUCCESS;
        const id_post = action.payload.id
        const myPosts =
          state.myPosts &&
          state.myPosts.results &&
          state.myPosts.results.filter(
            (post) => post.id !== id_post,
          );
        const homePosts =
          state.homePosts &&
          state.homePosts.results &&
          state.homePosts.results.filter(
            (post) => post.id !== id_post,
          );
        const yourPosts =
          state.yourPosts &&
          state.yourPosts.results &&
          state.yourPosts.results.filter(
            (post) => post.id !== id_post,
          );
        if (state.myPosts && state.myPosts.results) {
        state.myPosts.results = myPosts;
        }
        if (state.homePosts && state.homePosts.results) {
        state.homePosts.results = homePosts;
        }
        if (state.yourPosts && state.yourPosts.results) {
        state.yourPosts.results = yourPosts;
        }
    },
    [deletePost.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [deleteComment.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [deleteComment.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
        state.postState = DataStatus.SUCCESS;
        const id_comment = action.payload.id
        state.post = {...state.post, comments: {count: state.post.comments?.count - 1, data: state.post.comments?.data.filter((comment) => comment.id !== id_comment)}}
    },
    [deleteComment.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
    [changePost.pending.type]: (state) => {
      state.postState = DataStatus.LOADING;
      state.error = null;
    },
    [changePost.fulfilled.type]: (state, action: PayloadAction<PostResponse>) => {
        state.postState = DataStatus.SUCCESS;
        const id_post = action.payload.id
        const myPosts =
          state.myPosts &&
          state.myPosts.results &&
          state.myPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload;
            }
            return post;
          });
        const homePosts =
          state.homePosts &&
          state.homePosts.results &&
          state.homePosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload;
            }
            return post;
          });
        const yourPosts =
          state.yourPosts &&
          state.yourPosts.results &&
          state.yourPosts.results.map((post) => {
            if (post.id === id_post) {
              return action.payload;
            }
            return post;
          });
        if (state.myPosts && state.myPosts.results) {
        state.myPosts.results = myPosts;
        }
        if (state.homePosts && state.homePosts.results) {
        state.homePosts.results = homePosts;
        }
        if (state.yourPosts && state.yourPosts.results) {
        state.yourPosts.results = yourPosts;
        }
    },
    [changePost.rejected.type]: (state, action: PayloadAction<string>) => {
      state.postState = DataStatus.FAILED;
      state.error = action.payload;
    },
  },
});

export const { resetState, viewPost, popPost, resetYourPosts, resetHomePosts, resetMyPosts } = postSlice.actions;
export default postSlice.reducer;