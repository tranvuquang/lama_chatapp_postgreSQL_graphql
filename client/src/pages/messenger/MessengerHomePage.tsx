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

type Props = {};

const MessengerHomePage = (props: Props) => {
  const { user, accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  // const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const scrollRef = useRef();

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

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    if (newMessage) {
      const message = {
        sender: user.id,
        text: newMessage,
        conversationId: currentChat?.id,
      };
      // const receiverId = currentChat?.members.find(
      //   (member: string) => member !== user.id
      // );
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
