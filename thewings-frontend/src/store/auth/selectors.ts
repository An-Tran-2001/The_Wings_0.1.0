import { useAppDispatch, useAppSelector } from "../hooks";
import { useCallback } from "react";
import {
  confirmCode,
  ConfirmInfo,
  login,
  LoginInfo,
  register,
  RegisterInfo,
} from "./actions";
import { logout } from "./reducer";

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

  const onLogout = useCallback(async () => {
    dispatch(logout());
  }, [dispatch]);

  const onRegister = useCallback(
    async (info: RegisterInfo) => {
      await dispatch(register(info));
    },
    [dispatch],
  );

  const onConfirmCode = useCallback(
    async (info: ConfirmInfo) => {
      await dispatch(confirmCode(info));
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
    onLogout,
    onRegister,
    onConfirmCode,
  };
};
