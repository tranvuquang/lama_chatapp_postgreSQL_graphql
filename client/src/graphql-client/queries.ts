import { gql } from "@apollo/client";

const getPostsQuery = gql`
  query getPostsQuery {
    getPosts {
      id
      body
      createdAt
      username
      userId
      comments {
        id
        postId
        userId
        username
        body
        createdAt
      }
      likes {
        id
        postId
        userId
        username
        createdAt
      }
    }
  }
`;

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

export { getPostsQuery, getConversationsByUserIdQuery };
