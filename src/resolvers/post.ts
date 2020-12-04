import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const Models = require("../models");
const { Op } = require("sequelize");
const saltRounds = 10;
import dotenv from "dotenv";

const {
  Post: PostModel,
  User: UserModel,
  Group: GroupModel,
  Comment: CommentModel,
} = Models;
dotenv.config();

const postResolver: IResolvers = {
  Query: {
    GetPosts: async (_, { group_id, referencePostId, reference }) => {
      const group = GroupModel.findOne({
        where: { id: group_id },
      });
      if (!group) throw new Error("group does not exist");
      try {
        let posts;
        switch(reference){
          case 'new':
             posts = await PostModel.findAndCountAll({
              where: {
                group_id,
                id: { [Op.gt]: referencePostId },
              },
              include: {
                model: UserModel,
                attributes: ["id", "first_name", "last_name", "email", "profile_picture_url"],
              },
              order: [["createdAt", "DESC"]],
              limit: 20,
            });
            break
          case 'old':
             posts = await PostModel.findAndCountAll({
              where: {
                group_id,
                id: { [Op.lt]: referencePostId },
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
        console.log(posts.rows)
        return { posts: posts.rows };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    CreatePost: async (_, { message, user_id, group_id, image_url }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });

      if (!user) throw new Error("User does not exist");

      const group = await GroupModel.findOne({
        where: { id: group_id },
      });

      if (!group) throw new Error("Group does not exist");

      try {
        const newPost = await PostModel.create({
          message,
          user_id,
          group_id,
          image_url,
          number_of_likes: 0,
          number_of_comments: 0,
        });

        const post = PostModel.findOne({
          where: {id: newPost.id},
          include: {
            model: UserModel,
            attributes: ["id", "first_name", "last_name", "email", "profile_picture_url"],
          },
        })
        return {
          response: "Post created succesfully",
          posts: post,
        };
      } catch (error) {
        throw new Error(error);
      }
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
    LikePost: async (_, { post_id }) => {
      const post = await PostModel.findOne({
        where: { id: post_id },
      });

      if (!post) throw new Error("Post not found");

      try {
        post.number_of_likes = post.number_of_likes + 1;
        post.save();
      } catch (error) {
        throw new Error(error);
      }
      return "Success";
    },
  },
};

export default postResolver;
