import { useAppDispatch, useAppSelector } from "../hooks";
import { useCallback } from "react";
import {
  changeProfile,
  changeProfileInfo,
  confirmCode,
  ConfirmInfo,
  forgotPassword,
  ForgotPasswordInfo,
  login,
  LoginInfo,
  register,
  RegisterInfo,
  resetPassword,
  ResetPasswordInfo,
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
      return await dispatch(register(info)).unwrap();
    },
    [dispatch],
  );

  const onConfirmCode = useCallback(
    async (info: ConfirmInfo) => {
      return await dispatch(confirmCode(info)).unwrap();
    },
    [dispatch],
  );

  const onForgotPassword = useCallback(
    async (info: ForgotPasswordInfo) => {
      await dispatch(forgotPassword(info));
    },
    [dispatch],
  );

  const onResetPassword = useCallback(
    async (info: ResetPasswordInfo) => {
      await dispatch(resetPassword(info));
    },
    [dispatch],
  );

  const onChangeProfile = useCallback(
    async (info: changeProfileInfo) => {
      await dispatch(changeProfile(info));
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
    onForgotPassword,
    onResetPassword,
    onChangeProfile,
  };
};
