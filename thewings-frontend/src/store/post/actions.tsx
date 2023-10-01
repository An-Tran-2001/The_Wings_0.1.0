import { client, Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";
import { PostStatus } from "constant/enum";

export interface FilePayload {
  file: File;
  name: string;
}

export interface CreatePostPayload {
  content: string;
  files: FilePayload[];
  status: PostStatus;
  tags: string[];
}

export const createPost = createAsyncThunk(
  "post/createPost",
  async (payload: CreatePostPayload) => {
    try {
      const formData = new FormData();
      formData.append("content", payload.content);
      formData.append("status", payload.status);
      payload.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
      payload.files.forEach((filePayload) => {
        const { file, name } = filePayload;
        formData.append("files", file, name);
      });
      const response = await client.post(Endpoint.CREATE_POST, formData);
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
