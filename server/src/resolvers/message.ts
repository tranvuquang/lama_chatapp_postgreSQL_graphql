require("dotenv").config();
import { GraphQLError } from "graphql";
import db from "../models";
import { checkAuth } from "../middlewares/auth";

const { messages } = db;

export const messageResolver = {
  Query: {
    async getMessagesByConversationId(
      _parent: any,
      { id }: any,
      { accessToken }: any
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const messagesData = await messages.findAll({
          where: { conversationId: id },
        });
        return messagesData.map((mess: any) => {
          return {
            id: mess.id,
            conversationId: mess.conversationId,
            sender: mess.sender,
            text: mess.text,
            createdAt: mess.createdAt,
            updatedAt: mess.updatedAt,
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async createMessage(
      _parent: any,
      { conversationId, sender, text }: any,
      { accessToken }: any
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const message = await messages.create({
          conversationId,
          sender,
          text,
        });

        return {
          id: message.id,
          conversationId: message.conversationId,
          sender: message.sender,
          text: message.text,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
