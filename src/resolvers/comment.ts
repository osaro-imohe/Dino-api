import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const Models = require("../models");
const saltRounds = 10;
import dotenv from "dotenv";
import { first, create } from "lodash";
const { User: UserModel, Post: PostModel, Comment: CommentModel } = Models;
dotenv.config();

const commentResolver: IResolvers = {
  Mutation: {
    AddComment: async (_, { message, user_id, post_id }) => {
      const post = await PostModel.findOne({
        where: { id: post_id },
      });
      if (!post) throw new Error("Post could not be found");
      try {
        const comment = await CommentModel.create({
          message,
          user_id,
          post_id,
        });
      } catch (error) {
        throw new Error(error);
      }
      return { response: "Comment Added" };
    },
    DeleteComment: async (_, { user_id, post_id, comment_id }) => {
      const comment = await CommentModel.findOne({
        where: {
          user_id,
          post_id,
          id: comment_id,
        },
      });
      if (!comment) throw new Error("Comment does not exist");
      comment.destroy();
      return { response: "Comment deleted successfully" };
    },
  },
};

export default commentResolver;
