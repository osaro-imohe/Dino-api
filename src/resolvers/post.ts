import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const Models = require("../models");
const saltRounds = 10;
import dotenv from "dotenv";
import { isInteger } from "lodash";

const {
  Post: PostModel,
  User: UserModel,
  Group: GroupModel,
  Comment: CommentModel,
} = Models;
dotenv.config();

const postResolver: IResolvers = {
  Mutation: {
    CreatePost: async (_, { message, user_id, group_id }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });

      const group = await GroupModel.findOne({
        where: { id: group_id },
      });

      if (!user) throw new Error("User does not exist");
      if (!group) throw new Error("Group does not exist");

      try {
        const post = await PostModel.create({
          message,
          user_id,
          group_id,
        });
      } catch (error) {
        throw new Error(error);
      }
      return { response: "Created post" };
    },
    DeletePost: async (_, { post_id }) => {
      const post = await PostModel.findOne({
        where: { id: post_id },
      });

      if (!post) throw new Error("Post not found");

      try {
        await post.destroy();
      } catch (error) {
        throw new Error(error);
      }
      return { response: "Post deleted" };
    },
  },
};

export default postResolver;
