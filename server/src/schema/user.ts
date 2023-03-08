export const typeUser = `#graphql
  scalar Date

  type User {
    id: String!
    email: String!
    accessToken: String!
    createdAt: Date
    updatedAt: Date
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  type Query {
    getUser(id:String):User!
    getUsers:[User]!
  }
 
  type Mutation {
    register(email: String!, password: String!): User!
    login(email: String!, password: String!): User!
  }
`;
