import { useAppDispatch, useAppSelector } from "../hooks";
import { useCallback } from "react";
import { login, LoginInfo } from "./actions";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    userStatus: status,
    userError: error,
    refresh_token: refresh_token,
    access_token: access_token,
  } = useAppSelector((state) => state.auth);

  const onLogin = useCallback(
    async (info: LoginInfo) => {
      return await dispatch(login(info)).unwrap();
    },
    [dispatch],
  );
  return {
    user,
    status,
    error,
    refresh_token,
    access_token,
    onLogin,
  };
};