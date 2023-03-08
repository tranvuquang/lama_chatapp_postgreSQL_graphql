export const typeConversation = `#graphql
  scalar Date

  type Conversation {
    id: String!
    members: [String]!
    createdAt: Date
    updatedAt: Date
    users:[User]
  }

  type Query {
    getConversationsByUserId(id:String!):[Conversation]!
    getConversationBy2Users(senderId:String!,receiverId:String!):Conversation!
  }
 
  # type Mutation {
  #   register(email: String!, password: String!): User!
  #   login(email: String!, password: String!): User!
  # }
`;
