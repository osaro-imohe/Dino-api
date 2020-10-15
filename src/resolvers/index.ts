import { IResolvers } from "apollo-server-express";
import userResolver from "./user";
import groupResolver from "./group";
import postResolver from "./post";
import commentResolver from "./comment";

const resolvers: IResolvers = {
  userResolver,
  groupResolver,
  postResolver,
  commentResolver,
};

export default resolvers;
