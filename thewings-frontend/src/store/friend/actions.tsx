import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { AxiosError, HttpStatusCode } from "axios";
import { AN_ERROR_TRY_AGAIN } from "constant";

export interface addfriendPayload {
    friend: number;
}
export interface removefriendPayload {
    name: string;
}
export interface acceptRequestPayload {
    friend_id: number;
}

export const addFriend = createAsyncThunk(
  "friend/addFriend",
  async (payload: addfriendPayload) => {
    try {
      const response = await client.post(Endpoint.ADD_FRIEND, payload);
      if (response.status === HttpStatusCode.Created) {
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

export const removeFriend = createAsyncThunk(
    "friend/removeFriend",
    async (name: string) => {
        try {
        const response = await client.delete(Endpoint.REMOVE_FRIEND + name);
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

export const acceptRequest = createAsyncThunk(
    "friend/acceptRequest",
    async (payload: acceptRequestPayload) => {
        try {
        const response = await client.patch(Endpoint.ACCEPT_REQUEST, payload);
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

export const getFriends = createAsyncThunk(
    "friend/getFriends",
    async () => {
        try {
        const response = await client.get(Endpoint.GET_FRIENDS);
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

export const getRequests = createAsyncThunk(
    "friend/getRequests",
    async () => {
        try {
        const response = await client.get(Endpoint.GET_REQUESTS);
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

export interface blockUserPayload {
    black_friend: number;
}
export const blockUser = createAsyncThunk(
    "friend/blockUser",
    async (payload: blockUserPayload) => {
        try {
        const response = await client.post(Endpoint.BLOCK_USER, payload);
        if (response.status === HttpStatusCode.Created) {
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

export const getBlockUser = createAsyncThunk(
    "friend/getBlockUser",
    async () => {
        try {
        const response = await client.get(Endpoint.GET_BLOCK_USER);
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

export const unBlockUser = createAsyncThunk(
    "friend/unBlockUser",
    async (id: number) => {
        try {
        const response = await client.delete(Endpoint.UNBLOCK_USER + id);
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