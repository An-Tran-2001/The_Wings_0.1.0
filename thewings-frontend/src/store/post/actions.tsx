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
  tags: number[];
}

export const createPost = createAsyncThunk(
  "post/createPost",
  async (payload: CreatePostPayload) => {
    try {
      console.log(payload);
      const formData = new FormData();
      formData.append("content", payload.content);
      formData.append("status", payload.status);
      formData.append("tags", JSON.stringify(payload.tags));
      payload.files.forEach((filePayload, index) => {
        formData.append(`files[${index}][file]`, filePayload.file);
        formData.append(`files[${index}][name]`, filePayload.name);
      });
      console.log(formData);
      const response = await client.post(Endpoint.CREATE_POST, payload);
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
