import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const Models = require("../models");
const { Op } = require("sequelize");
const saltRounds = 10;
import dotenv from "dotenv";
import { first, create } from "lodash";
const { User: UserModel, Post: PostModel, Comment: CommentModel } = Models;
dotenv.config();

const commentResolver: IResolvers = {
  Query: {
    GetComments: async (_, { post_id, referenceCommentId, reference }) => {
      const post = await PostModel.findOne({
        where: {
          id: post_id,
        },
      });
      if (!post) throw new Error("Post could not be found");
      let Comment;
      switch(reference){
        case 'new':
          Comment = await post.getComments({
            where:{
              id: { [Op.gt]: referenceCommentId },
            },
            include: {
              model: UserModel,
              attributes: ["id", "first_name", "last_name", "email", "profile_picture_url"],
            },
            order: [["createdAt", "DESC"]],
            limit: 20,
          });
          break;
        case 'old':
          Comment = await post.getComments({
            where:{
              id: { [Op.lt]: referenceCommentId },
            },
            include: {
              model: UserModel,
              attributes: ["id", "first_name", "last_name", "email", "profile_picture_url"],
            },
            order: [["createdAt", "DESC"]],
            limit: 20,
          });
          break
      }
      return Comment;
    },
  },
  Mutation: {
    CreateComment: async (_, { message, user_id, post_id }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });
      if (!user) throw new Error("User could not be found");
      const post = await PostModel.findOne({
        where: { id: post_id },
      });
      if (!post) throw new Error("Post could not be found");
      post.number_of_comments = post.number_of_comments + 1;
      post.save();
      try {
        const comment = await CommentModel.create({
          message,
          user_id,
          post_id,
        });
        const returnedComment = await CommentModel.findOne({
          where: {
            id: comment.id,
          },
          include: {
            model: UserModel,
            attributes: ["id", "first_name", "last_name", "email", "profile_picture_url"],
          },
        });
        return returnedComment;
      } catch (error) {
        throw new Error(error);
      }
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
