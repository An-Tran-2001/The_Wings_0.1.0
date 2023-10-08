import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { acceptRequest, acceptRequestPayload, addFriend, addfriendPayload, getFriends, getRequests, removeFriend } from "./actions";

const useFriend = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.profile);
  const { friends, friendState, error: friendError, request } = useAppSelector((state) => state.friends);

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

  const onGetFriends = useCallback(
    async () => {
      try {
        await dispatch(getFriends()).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onGetRequests = useCallback(
    async () => {
      try {
        await dispatch(getRequests()).unwrap();
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
    friendState,
    friendError,
    request,
    onAddFriend,
    onRemoveFriend,
    onAcceptRequest,
    onGetFriends,
    onGetRequests,
  };
};

export default useFriend;
