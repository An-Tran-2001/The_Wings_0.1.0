import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { conversationParams, getConversations, getMessages, messageParams, searchUser } from "./actions";

export const useMessage = () => {
  const dispatch = useAppDispatch();

  const {
    users, conversations, messages, userStatus, userError,
  } = useAppSelector((state) => state.message);
  const onSearchUser = useCallback(
    async (info: string) => {
      return await dispatch(searchUser(info)).unwrap();
    },
    [dispatch],
  );
  const onGetConversations = useCallback(
    async (parames: conversationParams) => {
      return await dispatch(getConversations(parames)).unwrap();
    },
    [dispatch],
  );
  const onGetMessages = useCallback(
    async (parames: messageParams) => {
      return await dispatch(getMessages(parames)).unwrap();
    },
    [dispatch],
  );
  return { users, conversations, messages, onSearchUser, onGetConversations, onGetMessages };
};

