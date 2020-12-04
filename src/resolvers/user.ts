import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const Models = require("../models");
import dotenv from "dotenv";
const { User: UserModel } = Models;
dotenv.config();

const { JWT_SECRET } = process.env;

const generateToken = (
  id: number,
  first_name: string,
  last_name: string,
  email: string
) => {
  return jwt.sign({ id, email, first_name, last_name }, `${JWT_SECRET}`, {
    expiresIn: 84000,
  });
};

const userResolver: IResolvers = {
  Query: {
    GetUser: async (_, { user_id }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });
      if (!user) throw new Error("User does not exist");
      return user;
    },
  },
  Mutation: {
    SignUp: async (_, { first_name, last_name, email, password }) => {
      email = email.toLowerCase();
      const isUser = await UserModel.findOne({
        where: { email },
      });
      if (isUser) throw new Error("User already exists");
      try {
        const user = await UserModel.create({
          first_name,
          last_name,
          email,
          profile_picture_url: "",
          password: await bcrypt.hash(password, 10),
        });
        const token = generateToken(
          user.id,
          user.first_name,
          user.last_name,
          user.email
        );
        return {
          token,
          user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_picture_url: "",
          response: "User created successfully",
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    SignIn: async (_, { email, password }) => {
      email = email.toLowerCase();
      const user = await UserModel.findOne({
        where: {
          email,
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error("Invalid Email or Password");
      const token = generateToken(
        user.id,
        user.first_name,
        user.last_name,
        user.email
      );
      const payload = {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        token,
        response: "User authenticated successfully",
      };
      return payload;
    },
    ChangePassword: async (_, { user_id, old_password, new_password }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });
      if (!user) throw new Error("User does not exist");
      if (!(await bcrypt.compare(old_password, user.password)))
        throw new Error("Incorrect password");
      try {
        user.password = await bcrypt.hash(new_password, 10);
        user.save();
      } catch (error) {
        throw new Error(error);
      }
      return { response: "Password changed successfully" };
    },
  },
};

export default userResolver;
