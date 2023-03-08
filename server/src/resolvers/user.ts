require("dotenv").config();
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import db from "../models";
import { checkAuth } from "../middlewares/auth";

const { users } = db;

export const userResolver = {
  Query: {
    async getUser(_parent: any, { id }: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const user = await users.findByPk(id);
        if (!user) {
          throw new GraphQLError(`User not found!`);
        }
        return {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          accessToken: "",
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async getUsers(_parent: any, _args: any, { accessToken }: any) {
      try {
        if (!checkAuth(accessToken)) {
          throw new GraphQLError(`Token is invalid`);
        }
        const userData = await users.findAll();
        if (!userData) {
          throw new GraphQLError(`Users list not found!`);
        }
        return userData.map((user: any) => {
          return {
            id: user.id,
            email: user.email,
            accessToken: "",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        });
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    async login(_parent: any, { email, password }: any, _context: any) {
      try {
        const user = await users.findOne({ where: { email } });
        if (!user) {
          throw new GraphQLError(`User not found!`);
        }
        if (password !== user?.password) {
          throw new GraphQLError(`Wrong username or password!`);
        }
        const userData = {
          id: user.id,
          email,
        };
        const accessToken = jwt.sign(userData, process.env.JWT as string);
        return {
          email,
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },

    async register(_parent: any, { email, password }: any, _context: any) {
      try {
        const user = await users.findOne({ where: { email } });
        if (user) {
          throw new GraphQLError(`User already exists`);
        }
        const userData = await users.create({
          email,
          password,
        });
        const userInfo = {
          id: userData.id,
          email,
        };
        const accessToken = jwt.sign(userInfo, process.env.JWT as string);
        return {
          email,
          id: userData.id,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          accessToken,
        };
      } catch (error) {
        console.log(error.message);
        throw new GraphQLError(error.message);
      }
    },
  },
};
