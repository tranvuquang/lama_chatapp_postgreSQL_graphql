import { GraphQLDateTime } from "graphql-iso-date";
import { userResolver } from "./user";
import { conversationResolver } from "./conversation";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [customScalarResolver, userResolver, conversationResolver];

export default resolvers;
