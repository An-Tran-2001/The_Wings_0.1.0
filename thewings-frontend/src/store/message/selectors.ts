import { useAppDispatch, useAppSelector } from "store/hooks";
import { useCallback } from "react";
import { conversationParams, getConversations, getMessages, messageParams, searchUser } from "./actions";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Message, pushMessage, setReadyState, setSocket } from "./reducer";
import { WebSocketType } from "constant/enum";
interface Socket {
  sendJsonMessage: (message: any) => void;
  lastJsonMessage: any;
  readyState: ReadyState;
}

type SocketProps = {
  url: string;
  options?: object;
};

export interface SendMessagePayload {
  type: WebSocketType.CHAT_MESSAGE;
  message: string;
}

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

  const onSendMessage = useCallback(
    async (message: Message) => {
      console.log(message);
      console.log(pushMessage(message));
      return await dispatch(pushMessage(message));
    },
    [dispatch],
  );

  return { users, conversations, messages, onSearchUser, onGetConversations, onGetMessages, onSendMessage };
};

