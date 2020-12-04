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
        const group = {
          id: newGroup.id,
          description: "",
          name: newGroup.name,
          photo_url: newGroup.photo_url,
          invite_code: newGroup.invite_code,
          admin_user_id: newGroup.admin_user_id,
          number_of_members: newGroup.number_of_members,
        };
        return {
          response: "Created Successfully",
          groups: group,
        };
      } catch (error) {
        throw new Error("Group could not be created");
      }
    },
    JoinGroup: async (_, { user_id, invite_code }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });

      if (!user) throw new Error("User does not exist");

      const group = await GroupModel.findOne({
        where: { invite_code },
      });

      if (!group) throw new Error("The invite is invalid or has expired");

      const isUserInGroup = await UserGroupModel.findOne({
        where: {
          user_id,
          group_id: group.id,
        },
      });

      if (isUserInGroup) throw new Error("User already in group");

      try {
        const newUserGroup = await UserGroupModel.create({
          user_id,
          group_id: group.id,
        });

        group.number_of_members = group.number_of_members + 1;
        group.save();

        const joinedGroup = {
          id: group.id,
          name: group.name,
          photo_url: group.photo_url,
          description: group.description,
          invite_code: group.invite_code,
          admin_user_id: group.admin_user_id,
          number_of_members: group.number_of_members,
        };

        return { response: "User joined group", groups: joinedGroup };
      } catch (error) {
        throw new Error(error);
      }
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
  Query: {
    GetGroups: async (_, { user_id }) => {
      const user = await UserModel.findOne({
        where: { id: user_id },
      });
      if (!user) throw new Error("User does not exist");
      try {
        const groups = await user.getGroups({
          attributes: [
            "id",
            "name",
            "number_of_members",
            "photo_url",
            "admin_user_id",
            "description",
            "invite_code",
          ],
        });
        return { response: "Groups Found", groups: groups };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

export default groupResolver;
