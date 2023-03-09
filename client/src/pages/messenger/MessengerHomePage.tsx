import React, { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import Message from "../../features/messenger/components/Message/Message";
import Topbar from "../../features/messenger/components/Topbar/Topbar";
import { IConversation, IMessage } from "../../features/messenger/types";
import { mutationClient, queryClient } from "../../graphql-client/config";
import { createMessageMutation } from "../../graphql-client/mutations";
import {
  getConversationsByUserIdQuery,
  getMessagesByConversationIdQuery,
} from "../../graphql-client/queries";
import "../css/messenger.css";

import socketIOClient from "socket.io-client";
import { socketURL } from "../../constants";

const socket = socketIOClient(socketURL);

type Props = {};

const MessengerHomePage = (props: Props) => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const scrollRef = useRef();

  // lay thong tin cuoc hoi thoai cua user dang dang nhap
  useEffect(() => {
    if (user) {
      (async () => {
        const { data } = (await queryClient(
          accessToken,
          dispatch,
          getConversationsByUserIdQuery,
          {
            id: user.id,
          }
        )) as any;
        if (data) {
          setConversations(data.getConversationsByUserId);
        }
      })();
    }
  }, [accessToken, dispatch, user]);

  // lay cac tin nhan khi mo cuoc hoi thoai
  useEffect(() => {
    if (currentChat) {
      (async () => {
        const { data } = (await queryClient(
          accessToken,
          dispatch,
          getMessagesByConversationIdQuery,
          {
            id: currentChat.id,
          }
        )) as any;
        if (data) {
          setMessages(data.getMessagesByConversationId);
        }
      })();
    }
  }, [accessToken, currentChat, dispatch]);

  // save message vao dung dia chi cua nguoi nhan
  useEffect(() => {
    if (arrivalMessage) {
      // neu tin nhan den dung voi cua so chat. chi thay doi khi co tin nhan moi den
      if (currentChat?.members.includes(arrivalMessage.sender)) {
        setMessages((prev) => [...prev, arrivalMessage] as any);
      }
      // neu chua mo cua so chat
      if (!currentChat) {
        console.log("!currentChat");
      }
      // da mo cua so chat nhung tin nhan den ko phai cua cua so chat
      if (
        currentChat &&
        !currentChat?.members.includes(arrivalMessage.sender)
      ) {
        console.log("currentChat");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage]);

  // socket logic start very important ==========================
  // ket noi socket va disconnect
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});

    socket.on("getMessageFromSocket", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getMessageFromSocket");
    };
  }, []);

  // add user khi da ket noi va get user ve client
  useEffect(() => {
    socket.emit("addUserFromClient", user.id);
    socket.on("getUsersFromSocket", (users) => {
      // setOnlineUsers(
      //   user.followings.filter((f) =>
      //     users.some((u: { userId: string }) => u.userId === f)
      //   )
      // );
    });
  }, [user]);
  // socket logic end

  // gui tin nhan
  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (newMessage) {
      const message = {
        sender: user.id,
        text: newMessage,
        conversationId: currentChat?.id,
      };
      const receiverId = currentChat?.members.find(
        (member: string) => member !== user.id
      );
      socket.emit("sendMessageFromClient", {
        senderId: user.id,
        receiverId,
        text: newMessage,
      });
      const { resData, reFetchData } = (await mutationClient(
        accessToken,
        dispatch,
        createMessageMutation,
        message,
        getMessagesByConversationIdQuery,
        { id: currentChat?.id }
      )) as any;
      if (resData && reFetchData) {
        setMessages(reFetchData.data.getMessagesByConversationId);
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    const current = scrollRef.current as any;
    current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations &&
              conversations.length > 0 &&
              conversations.map((conv: any, index: number) => {
                const receiverUser = conv.users.filter((user2: any) => {
                  return user2.id !== user.id;
                });
                return (
                  <div
                    onClick={() => setCurrentChat(conv as IConversation)}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    {receiverUser[0].email.split("@")[0]}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages &&
                    messages.length > 0 &&
                    messages.map((m, index) => {
                      return (
                        <div key={index} ref={scrollRef as any}>
                          <Message message={m} own={m.sender === user.id} />
                        </div>
                      );
                    })}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {/* <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={onSetCurrentChat}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessengerHomePage;
