import { client,Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";

export interface LoginInfo {
    username_email: string;
    password: string;
}

export const login = createAsyncThunk("auth/login", async (info: LoginInfo) => {
  try {
    const response = await client.post(Endpoint.LOGIN, info) ;
    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    if ((error as AxiosError).response?.status === HttpStatusCode.Unauthorized)
      throw AN_ERROR_TRY_AGAIN;
    throw error;
  }
});