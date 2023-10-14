import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  acceptRequest,
  acceptRequestPayload,
  addFriend,
  addfriendPayload,
  blockUser,
  blockUserPayload,
  getBlockUser,
  getFriends,
  getRequests,
  removeFriend,
  unBlockUser,
} from "./actions";

const useFriend = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.profile);
  const {
    friends,
    friendState,
    error: friendError,
    request,
    block,
  } = useAppSelector((state) => state.friends);

  const onAddFriend = useCallback(
    async (paylaod: addfriendPayload) => {
      try {
        await dispatch(addFriend(paylaod)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );
  const onRemoveFriend = useCallback(
    async (name: string) => {
      try {
        await dispatch(removeFriend(name)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onAcceptRequest = useCallback(
    async (payload: acceptRequestPayload) => {
      try {
        await dispatch(acceptRequest(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onGetFriends = useCallback(async () => {
    try {
      await dispatch(getFriends()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const onGetRequests = useCallback(async () => {
    try {
      await dispatch(getRequests()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);
  const onBlockUser = useCallback(
    async (payload: blockUserPayload) => {
      try {
        return await dispatch(blockUser(payload)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );
  const onGetBlockUser = useCallback(async () => {
    try {
      return await dispatch(getBlockUser()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const onunBlockUser = useCallback(
    async (id: number) => {
      try {
        await dispatch(unBlockUser(id)).unwrap();
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
    friends,
    block,
    friendState,
    friendError,
    request,
    onAddFriend,
    onRemoveFriend,
    onAcceptRequest,
    onGetFriends,
    onGetRequests,
    onBlockUser,
    onGetBlockUser,
    onunBlockUser,
  };
};

export default useFriend;
