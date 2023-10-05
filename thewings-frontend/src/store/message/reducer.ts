import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getConversations, getMessages, searchUser } from "./actions";
import { User } from "store/auth";
import { DataStatus } from "constant/enum";
import { AN_ERROR_TRY_AGAIN } from "constant";

export interface pagePaggings {
  count: number,
  next: string,
  previous: string,
}

export interface UserConversation{
  id: number;
  username: string;
  name: string;
  avatar: string;
}
export interface Message {
  id: string;
  conversation: string;
  from_user: UserConversation;
  to_user: UserConversation;
  content: string;
  timestamp: string;
  read: boolean;
}
export interface conversationsStatus {
  id: string;
  name : string;
  other_user: UserConversation;
  last_message: Message;
}

export interface conversations extends pagePaggings{
  results: conversationsStatus[]
}

export interface Messages extends pagePaggings{
  results: Message[]
}
export interface messageState {
  users: User[];
  conversations?: conversations;
  messages?: Messages;
  userStatus: DataStatus;
  userError?: string;
  messageStatus?: DataStatus;
  messageError?: string;
  readyState?: string;
  socket?: WebSocket;
}

const initialState: messageState = {
  users: [],
  conversations: undefined,
  messages: undefined,
  userStatus: DataStatus.IDLE,
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setReadyState: (state, action: PayloadAction<string>) => {
      state.readyState = action.payload;
    },
    pushMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (state.messages) {
        if (!state.messages.results) {
          state.messages.results = [];
        }
        state.messages.results.push(message);
      }
    },
  },
  extraReducers: (build) => {
    build
      .addCase(searchUser.pending, (state) => {
        state.userStatus = DataStatus.LOADING;
      })
      .addCase(searchUser.fulfilled, (state, action: PayloadAction<User[]>) => {
        const users = action.payload;
        state.users = users;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.userStatus = DataStatus.FAILED;
        state.userError = action.error?.message || AN_ERROR_TRY_AGAIN;
      })
      .addCase(getConversations.pending, (state) => {
        state.userStatus = DataStatus.LOADING;
      })
      .addCase(
        getConversations.fulfilled,
        (state, action: PayloadAction<conversations>) => {
          state.conversations = action.payload;
        },
      )
      .addCase(getConversations.rejected, (state, action) => {
        state.userStatus = DataStatus.FAILED;
        state.userError = action.error?.message || AN_ERROR_TRY_AGAIN;
      })
      .addCase(getMessages.pending, (state) => {
        state.messageStatus = DataStatus.LOADING;
      })
      .addCase(
        getMessages.fulfilled,
        (state, action: PayloadAction<Messages>) => {
          state.messages = action.payload;
        },
      )
      .addCase(getMessages.rejected, (state, action) => {
        state.messageStatus = DataStatus.FAILED;
        state.messageError = action.error?.message || AN_ERROR_TRY_AGAIN;
      });
  },
});

export const { pushMessage, setReadyState, setSocket } = messageSlice.actions;
export default messageSlice.reducer;