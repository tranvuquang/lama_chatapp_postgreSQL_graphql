import { gql } from "@apollo/client";

const getConversationsByUserIdQuery = gql`
  query getConversationsByUserIdQuery($id: String!) {
    getConversationsByUserId(id: $id) {
      createdAt
      id
      members
      updatedAt
      users {
        accessToken
        createdAt
        email
        id
        updatedAt
      }
    }
  }
`;

const getMessagesByConversationIdQuery = gql`
  query getMessagesByConversationIdQuery($id: String!) {
    getMessagesByConversationId(id: $id) {
      conversationId
      createdAt
      id
      sender
      text
      updatedAt
    }
  }
`;

export { getMessagesByConversationIdQuery, getConversationsByUserIdQuery };
