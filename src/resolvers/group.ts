import { IResolvers } from "apollo-server-express";
import * as jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const Models = require("../models");
const saltRounds = 10;
import dotenv from "dotenv";
import { generateInviteCode } from "../helpers";

const {
  User: UserModel,
  Group: GroupModel,
  User_Groups: UserGroupModel,
} = Models;
dotenv.config();

const groupResolver: IResolvers = {
  Mutation: {
    CreateGroup: async (_, { user_id, name, photo_url }) => {
      console.log(user_id);
      try {
        const user = await UserModel.findOne({
          where: { id: user_id },
        });
        if (!user || user_id === 0)
          throw new Error("Group could not be created");
        const invite_code = generateInviteCode();
        const newGroup = await GroupModel.create({
          name,
          photo_url,
          invite_code,
          admin_user_id: user_id,
          number_of_members: 1,
        });
        const newUserGroup = await UserGroupModel.create({
          user_id,
          group_id: newGroup.id,
        });
        return {
          response: "Created Successfully",
          group_id: newGroup.id,
          name: newGroup.name,
          photo_url: newGroup.photo_url,
          invite_code: newGroup.invite_code,
          number_of_members: newGroup.number_of_members,
        };
      } catch (error) {
        throw new Error("Group could not be created");
      }
    },
    JoinGroup: async (_, { user_id, group_id }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });

      const group = await GroupModel.findOne({
        where: { id: group_id },
      });

      const isUserInGroup = await UserGroupModel.findOne({
        where: {
          user_id,
          group_id,
        },
      });

      if (!user) throw new Error("User does not exist");
      if (!group) throw new Error("Group does not exist");
      if (isUserInGroup) throw new Error("User already in group");

      try {
        const newUserGroup = await UserGroupModel.create({
          user_id,
          group_id,
        });
      } catch (error) {
        throw new Error(error);
      }
      return "User joined group";
    },
    LeaveGroup: async (_, { user_id, group_id }) => {
      const group = await GroupModel.findOne({
        where: { id: group_id },
      });

      if (!group) throw new Error("Group does not exist");

      const userGroupRelation = await UserGroupModel.findOne({
        where: {
          user_id,
          group_id,
        },
      });

      if (!userGroupRelation) throw new Error("User is not in group");

      userGroupRelation.destroy();
      return { response: "Succesfully left group" };
    },
    DeleteGroup: async (_, { group_id }) => {
      const group = await GroupModel.findOne({
        where: { id: group_id },
      });
      const userGroups = await UserGroupModel.findAll({
        where: { group_id },
      });
      if (!group) throw new Error("Group does not exist");
      group.destroy();
      for (let i = 0; i < userGroups.length; ++i) {
        userGroups[i].destroy();
      }
      return { response: "Group deleted successfully" };
    },
  },
};

export default groupResolver;
