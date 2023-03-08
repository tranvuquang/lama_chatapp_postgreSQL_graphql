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

const getPostQuery = gql`
  query getPostQuery ($postId: ID!) {
    getPost (postId: $postId) {
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

export { getPostsQuery, getPostQuery };
