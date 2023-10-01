import { client, Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";
import { PostStatus } from "constant/enum";

export interface CreatePostPayload {
  content: string;
  files: File[];
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

