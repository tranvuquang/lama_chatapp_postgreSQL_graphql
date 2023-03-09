export type IConversation = {
  id: string;
  members: string[];
};

export type IMessage = {
  id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt:number
};


export type MessengerState = {};

export const conversationDefaultData: IConversation = {
  id: "",
  members: [],
};
