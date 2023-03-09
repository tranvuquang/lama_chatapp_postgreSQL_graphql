require("dotenv").config();
import { GraphQLError } from "graphql";
import db from "../models";
import { Op } from "sequelize";
import { checkAuth } from "../middlewares/auth";

const { conversations, users } = db;

export const conversationResolver = {
  Conversation: {
    users: async (parent: any, _args: any) => {
      try {
        const id1 = parent.members[0];
        const id2 = parent.members[1];
        const user1 = await users.findByPk(id1);
        const user2 = await users.findByPk(id2);
        return [
          {
            id: user1.id,
            email: user1.email,
            accessToken: "",
            createdAt: user1.createdAt,
            updatedAt: user1.updatedAt,
          },
          {
            id: user2.id,
            email: user2.email,
            accessToken: "",
            createdAt: user2.createdAt,
            updatedAt: user2.updatedAt,
          },
        ];
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Query: {
    async getConversationsByUserId(
      _parent: any,
      { id }: any,
      { accessToken }: any
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const conversationsData = await conversations.findAll({
          where: { members: { [Op.contains]: [`${id}`] } },
        });
        return conversationsData.map((conv: any) => {
          return {
            id: conv.id,
            members: conv.members,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async getConversationBy2Users(
      _parent: any,
      { senderId, receiverId }: any,
      { accessToken }: any
    ) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const conversationsData = await conversations.findAll({
          where: {
            members: { [Op.contains]: [`${senderId}`, `${receiverId}`] },
          },
        });
        return {
          id: conversationsData[0].id,
          members: conversationsData[0].members,
          createdAt: conversationsData[0].createdAt,
          updatedAt: conversationsData[0].updatedAt,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
