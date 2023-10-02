import { client, Endpoint } from "api";
import { AN_ERROR_TRY_AGAIN } from "constant";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";

export interface LoginInfo {
  username_email: string;
  password: string;
}

export interface RegisterInfo {
  username: string;
  email: string;
  phone_number: string;
  name: string;
  tc?: boolean;
  password: string;
  password2: string;
}

export interface ConfirmInfo {
  email: string;
  code: string;
}

export interface ForgotPasswordInfo {
  email: string;
}

export interface ResetPasswordInfo {
  email: string;
  code: string;
  password: string;
  password2: string;
}

export const login = createAsyncThunk("auth/login", async (info: LoginInfo) => {
  try {
    const response = await client.post(Endpoint.LOGIN, info);
    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
      throw AN_ERROR_TRY_AGAIN;
    throw error;
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (info: RegisterInfo) => {
    try {
      const response = await client.post(Endpoint.REGISTER, info);
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

export const getInfo = createAsyncThunk("auth/getinfo", async () => {
  try {
    const response = await client.get(Endpoint.GETINFO);
    if (response.status === HttpStatusCode.Created) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    if ((error as AxiosError).response?.status === HttpStatusCode.BadRequest)
      throw AN_ERROR_TRY_AGAIN;
    throw error;
  }
});

export const confirmCode = createAsyncThunk(
  "auth/confirmCode",
  async (info: ConfirmInfo) => {
    try {
      const response = await client.post(Endpoint.CONFIRM_CODE, info);
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

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (info: ForgotPasswordInfo) => {
    try {
      const response = await client.post(Endpoint.FORGOT_PASSWORD, info);
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

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (info: ResetPasswordInfo) => {
    try {
      const response = await client.put(Endpoint.RESET_PASSWORD, info);
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


