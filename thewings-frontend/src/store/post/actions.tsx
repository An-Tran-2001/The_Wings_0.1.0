import { client, Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";
import { LikeStatus, PostStatus } from "constant/enum";
import { DataLike, Post } from "./reducer";

export interface CreatePostPayload {
  content: string;
  files: File[];
  status: PostStatus;
  tags: number[];
}

export interface CreateCommentPayload {
  content?: string;
  posts: number;
  parent?: number;
}

export const createPost = createAsyncThunk(
  "post/createPost",
  async (payload: CreatePostPayload) => {
    try {
      console.log(payload);
      const formData = new FormData();
      formData.append("content", payload.content);
      formData.append("status", payload.status);    
        payload.tags.forEach((tag) => {
            formData.append("tags", tag.toString());
        });

        for (let i = 0; i < payload.files.length; i++) {
            formData.append("files", payload.files[i]);
        }

      console.log(formData);
      const response = await client.post(Endpoint.CREATE_POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);


export const getPosts = createAsyncThunk(
  "post/getPosts",
  async () => {
    try {
      const response = await client.get(Endpoint.GET_MY_POSTS);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);


export const getPostsHome = createAsyncThunk(
  "post/getPostsHome",
  async () => {
    try {
      const response = await client.get(Endpoint.GET_HOME_POSTS);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);

export const getOrtherPosts = createAsyncThunk(
  "post/getOrtherPosts",
  async (username: string) => {
    try {
      const endpoint = Endpoint.GET_OTHER_POSTS + username + "/";
      const response = await client.get(endpoint);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);

export interface LikeSet {
  status: LikeStatus;
  post?: Post;
  comment?: number;
}


export const postLike = createAsyncThunk(
  "post/postLike",
  async (props: LikeSet) => {
    try {
      const response = await client.post(Endpoint.POST_LIKE, props);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (props: CreateCommentPayload) => {
    try {
      const response = await client.post(Endpoint.POST_COMMENT, props);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: number) => {
    try {
      const endpoint = Endpoint.GET_OTHER_POSTS + id + "/delete_post/";
      const response = await client.delete(endpoint);
      return { id, response: response.data}
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (id: number) => {
    try {
      const endpoint = Endpoint.POST_COMMENT + id + "/";
      const response = await client.delete(endpoint);
      return { id, response: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(AN_ERROR_TRY_AGAIN);
      }
      throw error;
    }
  },
);