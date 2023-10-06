
import { client, Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";

export interface conversationParams {
  name: string;
} 

export interface messageParams {
  conversation: string;
  page: number;
  page_size: number;
}

export const searchUser = createAsyncThunk(
  "message/searchUser",
  async (username: string) => {
    try {
      const response = await client.post(Endpoint.SEARCH_USER, { key_name: username });
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
        throw AN_ERROR_TRY_AGAIN;
      throw error;
    }
  },
);

export const getConversations = createAsyncThunk(
  "message/getConversations",
  async () => {
    try {
      const response = await client.get(Endpoint.GET_CONVERSATIONS);
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
        throw AN_ERROR_TRY_AGAIN;
      throw error;
    }
  },
);

export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (params: messageParams) => {
    try {
      const enpoint = Endpoint.GET_MESSAGES + `?conversation=${params.conversation}&page_size=${params.page_size}&page=${params.page}`;
      const response = await client.get(enpoint);
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
        throw AN_ERROR_TRY_AGAIN;
      throw error;
    }
  }
)

export const callMessages = () => async (params: messageParams) => {
    try {
      const enpoint =
        Endpoint.GET_MESSAGES +
        `?conversation=${params.conversation}&page_size=${params.page_size}&page=${params.page}`;
      const response = await client.get(enpoint);
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
        throw AN_ERROR_TRY_AGAIN;
      throw error;
    }
}