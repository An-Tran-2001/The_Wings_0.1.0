import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getProfile } from "./actions";

const useProfiles = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.profile);

  const onGetProfile = useCallback(
    async (username: string) => {
      try {
        await dispatch(getProfile(username)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    user,
    status,
    error,
    onGetProfile,
  };
};

export default useProfiles;
