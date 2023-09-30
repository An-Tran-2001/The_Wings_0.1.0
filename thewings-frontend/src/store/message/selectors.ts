import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { searchUser } from "./actions";

export const useMessage = () => {
  const dispatch = useAppDispatch();

  const {
    users
  } = useAppSelector((state) => state.message);
  const onSearchUser = useCallback(
    async (info: string) => {
      return await dispatch(searchUser(info)).unwrap();
    },
    [dispatch],
  );
  return { users, onSearchUser };
};

