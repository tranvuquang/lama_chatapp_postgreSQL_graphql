export const typeMessage = `#graphql
  scalar Date

  type Message {
    id: String!
    conversationId: String!
    sender:String!
    text:String!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getMessagesByConversationId(id:String!):[Message]!
  }
 
  type Mutation {
    createMessage(conversationId: String!, sender: String!, text: String!): Message!
  }
`;
