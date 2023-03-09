import { GraphQLDateTime } from "graphql-iso-date";
import { userResolver } from "./user";
import { conversationResolver } from "./conversation";
import { messageResolver } from "./message";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolver,
  conversationResolver,
  messageResolver,
];

export default resolvers;
