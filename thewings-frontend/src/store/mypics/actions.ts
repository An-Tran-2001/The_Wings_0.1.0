import { createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { AxiosError, HttpStatusCode } from "axios";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { PagePaginationRequest } from "store/interfaces";


export const getMyPics = createAsyncThunk(
    "my_pics/getMyPics",
    async (params: PagePaginationRequest, { rejectWithValue }) => {
        try {
            const url = new URLSearchParams(params as any).toString();
            const response = await client.get(`${Endpoint.MY_PICS}?${url}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === HttpStatusCode.Unauthorized) {
                return rejectWithValue(AN_ERROR_TRY_AGAIN);
            }
            return rejectWithValue(err.message);
        }
    }
);

export interface getYoursPicsParams extends PagePaginationRequest {
    username: string;
}

export const getYoursPics = createAsyncThunk(
    "my_pics/getYoursPics",
    async (params: getYoursPicsParams, { rejectWithValue }) => {
        try {
            const { username, page, page_size } = params;
            const url = `${Endpoint.YOURS_PICS}${username}/?page=${page}&page_size=${page_size}`;
            const response = await client.get(url);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === HttpStatusCode.Unauthorized) {
                return rejectWithValue(AN_ERROR_TRY_AGAIN);
            }
            return rejectWithValue(err.message);
        }
    }
);