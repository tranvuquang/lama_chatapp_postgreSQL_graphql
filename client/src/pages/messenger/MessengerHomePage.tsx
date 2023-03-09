import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useAppSelector /* , useAppDispatch */ } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import Topbar from "../../features/messenger/components/Topbar/Topbar";
import { IConversation, IMessage } from "../../features/messenger/types";
import { getConversationsByUserIdQuery } from "../../graphql-client/queries";
import "../css/messenger.css";

type Props = {};

const MessengerHomePage = (props: Props) => {
  const { user /* accessToken */ } = useAppSelector(selectAuth);
  // const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentChat, setCurrentChat] = useState<IConversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages /* setMessages */] = useState<IMessage[]>([]);
  // const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const conversationsData = useQuery(getConversationsByUserIdQuery, {
    variables: {
      id: user.id,
    },
  });

  useEffect(() => {
    if (conversationsData.data) {
      setConversations(conversationsData.data.getConversationsByUserId);
    }
  }, [conversationsData.data]);

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
  };

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
                        <div key={index} /* ref={scrollRef as any} */>
                          {/* <Message message={m} own={m.sender === user.id} /> */}
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
