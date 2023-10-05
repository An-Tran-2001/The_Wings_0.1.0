import { ReactElement, useEffect, useState } from "react";
import { DashboardLayout } from "../../layout";
import { Stack, TextField } from "@mui/material";
import Search from "../../components/layout/Header/Search";
import { StyledBadge } from "components/post/Post";
import Avatar from "@mui/material/Avatar";
import { conversationParams, messageParams } from "store/message/actions";
import { useMessage } from "store/message/selectors";
import { useAuth } from "store/auth";
import { Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message, pushMessage } from "store/message/reducer";
import useWebSocket from "react-use-websocket";
import { SOCKET_URL } from "constant";
import { WebSocketType } from "constant/enum";
import { useAppDispatch } from "store/hooks";
interface MessageProps {
  message: Message;
  position: 'left' | 'right';
}

interface SendMessage {
  type: WebSocketType.CHAT_MESSAGE;
  message: string;
}
interface TypingMessage {
  type: WebSocketType.TYPING;
  typing: WebSocketType.TYPING_TRUE | WebSocketType.TYPING_FALSE;
  typing_response?: TypingResponse;
}

interface TypingResponse {
  type: WebSocketType.TYPING;
  user: string;
  typing: WebSocketType.TYPING_TRUE | WebSocketType.TYPING_FALSE;
}

const MessageComponent = (messageprops: MessageProps) => {
  const isLeft = messageprops.position === "left";
  return (
    <div
      className={`w-[96%] flex flex-row ${
        isLeft ? "justify-start" : "justify-end"
      }`}
      key={messageprops.message.id}
    >
      {isLeft ? (
        <>
          <Avatar
            src={`http://localhost:8000${messageprops.message.from_user?.avatar}`}
            alt="Name"
            className=" bg-white mx-3"
            sx={{ width: 40, height: 40 }}
          />
          <p className="text-white bg-neutral-900 rounded-2xl font-light text-[10px] p-3 max-w-lg">
            {messageprops.message.content}
          </p>
        </>
      ) : (
        <>
          <p className="text-white bg-neutral-900 rounded-2xl font-light text-[10px] max-w-lg p-3">
            {messageprops.message.content}
          </p>
          <Avatar
            src={`http://localhost:8000${messageprops.message.from_user?.avatar}`}
            alt="Name"
            className=" bg-white mx-3"
            sx={{ width: 40, height: 40 }}
          />
        </>
      )}
    </div>
  );
}


const Message = () => {
  const { user } = useAuth();
  const [name, setName] = useState<conversationParams>(INITIAL_VALUES);
  const [typing, setTyping] = useState<TypingMessage>(INIT_VALUES_TYPING_MESSAGE);
  const { conversations, onGetConversations, messages, onGetMessages, onSendMessage } = useMessage();
  const [ getMessages, setGetMessages ] = useState<messageParams>(INIT_VALUES_MESSAGE);
  const [ sendMessage, setSendMessage ] = useState<SendMessage>(INIT_VALUES_SEND_MESSAGE);
  const token = localStorage.getItem("token");
  const uri = `${SOCKET_URL}messaging/${conversations?.results[0].name}/?token=${
    token || ""
  }`;

  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    uri,
    {
      onOpen: () => console.log("opened"),
      shouldReconnect: (closeEvent) => true,
      onClose: () => console.log("closed"),
      onError: (event) => console.log("error", event),
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case WebSocketType.CHAT_MESSAGE_ECHO:
            onSendMessage(data.message);
            break;
          case WebSocketType.TYPING:
            setTyping({ ...typing, typing_response: data });
            break;
          default:
            console.error("Unknown message type!");
            console.log(data);
            break;
        }
      },
    },
  );
  const SubmitMessage = (e: any) => {
    e.preventDefault();
    sendJsonMessage(sendMessage);
    setSendMessage({ ...sendMessage, message: "" });
    setTyping({ ...typing, typing: WebSocketType.TYPING_FALSE });
    sendJsonMessage(INIT_VALUES_TYPING_MESSAGE);
  }
  const handleTypingMessage = (e: any) => {
    e.preventDefault();
    setSendMessage({ ...sendMessage, message: e.target.value });
    setTyping({ ...typing, typing: WebSocketType.TYPING_TRUE });
    
    if (sendMessage.message === "") {
      setTyping({ ...typing, typing: WebSocketType.TYPING_FALSE });
    } else {
    sendJsonMessage(typing);}
  }

  const handleGetMessages = (conversation: string) => {
    setGetMessages({
      ...getMessages,
      conversation: conversation,
    })
  }
  const handleCreateConversationName = (e: any) => {
    setName({
      ...name,
      name: e.target.value,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      if (name) {
        await onGetConversations(name);
      }
      if (getMessages.conversation === "") {
        getMessages.conversation = conversations?.results[0]?.name || "";
      }
      if (getMessages) {
        await onGetMessages(getMessages);
      }
    };
    fetchData();
  }, [onGetConversations, name, onGetMessages, getMessages, onSendMessage, messages]);
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" height="92vh">
      <div className="grid grid-cols-4 h-full w-full box-border">
        <div className="h-ful col-span-1 w-full p-3">
          <div className="bg-neutral-800 rounded-2xl w-full h-full p-2">
            <h1 className="p-3 text-center text-2xl font-serif font-bold text-white ">
              Message
            </h1>
            <Search justifyContent="space-between" className="relative mb-3" />
            {conversations && conversations?.results.length > 0 ? (
              conversations?.results.map((conversation) => {
                const otherUser = conversation.other_user || {};
                const lastMessage = conversation.last_message || {};
                const toUser = lastMessage.to_user || {};
                const fromUser = lastMessage.from_user || {};
                const conversation_name = conversation.name || "";
                return (
                  <div
                    className="flex items-center w-full p-2 rounded-2xl mt-3 flex-col bg-neutral-900"
                    key={conversation.id}
                    onClick={(e) => handleGetMessages(conversation_name)}
                  >
                    <div className="flex flex-row w-full py-1 items-center border-b-2 border-neutral-700">
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        className="mr-3 ml-3"
                      >
                        <Avatar
                          src={`http://localhost:8000${otherUser.avatar}`}
                          alt="Name"
                          className=" bg-white"
                          sx={{ width: 50, height: 50 }}
                        />
                      </StyledBadge>
                      <div className="flex flex-col ml-2">
                        <h1 className="text-white font-bold whitespace-nowrap">
                          {otherUser.name}
                        </h1>
                        <p className="text-white text-[8px] font-light">
                          Online
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row w-full items-center p-2 pl-4">
                      <Avatar
                        src={`http://localhost:8000${fromUser.avatar}`}
                        alt="Name"
                        className="mx-2 bg-white "
                        sx={{ width: 25, height: 25 }}
                      />
                      <p className="whitespace-nowrap">{toUser.name} : </p>
                      <p className="text-white font-light text-[10px] pl-2 pt-1 max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                        {lastMessage.content}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="h-full w-full col-span-3 p-3">
          <form
            className="h-full w-full bg-neutral-800 flex justify-end flex-col space-y-4 items-end relative overflow-hidden rounded-2xl pb-3 "
            onSubmit={(e) => SubmitMessage(e)}  
          >
            <div className="bg-zinc-900 w-full absolute top-0 p-3 overflow-auto flex flex-row">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
                className="mr-3 ml-3"
              >
                <Avatar
                  src={`http://localhost:8000${conversations?.results[0]?.other_user?.avatar}`}
                  alt="Name"
                  className=" bg-white"
                  sx={{ width: 40, height: 40 }}
                />
              </StyledBadge>
              <div className="ml-2">
                <h1 className="text-white font-bold">
                  {conversations?.results[0]?.other_user?.name}
                </h1>
                <p className="text-white text-[8px] font-light">Online</p>
              </div>
            </div>
            {messages?.results && messages?.results.length > 0 ? (
              (messages?.results || [])
                .slice()
                .reverse()
                .map((message) => {
                  return (
                    <div
                      className="w-full flex items-center justify-center"
                      key={message.id}
                    >
                      {message.from_user?.id === user?.id ? (
                        <MessageComponent message={message} position="right" />
                      ) : (
                        <MessageComponent message={message} position="left" />
                      )}
                      <div className="ml-2"></div>
                    </div>
                  );
                })
            ) : (
              <></>
            )}
            <div className="w-full flex items-center justify-center">
              {typing.typing_response?.user !== user?.username ? (
                typing.typing_response?.typing === WebSocketType.TYPING_TRUE ? (
                  <p className="text-white font-light text-[10px] pl-2 pt-1 max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {typing.typing_response?.user} is typing...
                  </p>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
            <Input
              className="w-[98%] bg-slate-500 p-3 rounded-2xl relative"
              placeholder="Message"
              disableUnderline
              onChange={handleTypingMessage}
              endAdornment={<SendIcon className="text-white cursor-pointer" />}
            />
          </form>
        </div>
      </div>
    </Stack>
  );
};

export default Message;

Message.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

const INITIAL_VALUES: conversationParams = {
  name: "",
};

const INIT_VALUES_MESSAGE: messageParams = {
  conversation: "",
  page: 1,
  page_size: 30,
};

const INIT_VALUES_SEND_MESSAGE: SendMessage = {
  type: WebSocketType.CHAT_MESSAGE,
  message: "",
};
const INIT_VALUES_TYPING_MESSAGE: TypingMessage = {
  type: WebSocketType.TYPING,
  typing: WebSocketType.TYPING_FALSE,
};