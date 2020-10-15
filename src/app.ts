import express from "express";
import bodyParser from "body-parser";
import { ApolloServer, gql, mergeSchemas } from "apollo-server-express";
import dotenv from "dotenv";
import cors from "cors";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { merge } from "lodash";

const {
  userResolver,
  groupResolver,
  postResolver,
  commentResolver,
} = resolvers;

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const server = new ApolloServer({
  typeDefs,
  resolvers: merge([
    userResolver,
    groupResolver,
    postResolver,
    commentResolver,
  ]),
});

server.applyMiddleware({ app });

app.use("*", cors());

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
