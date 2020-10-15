const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: Int
    first_name: String
    last_name: String
    email: String
  }

  type Posts {
    id: Int
    message: String
    user_id: Int
    group_id: String
    comments: [Comments!]
  }

  type Comments {
    id: Int
    message: String
    user_id: String
    post_id: String
  }

  type Friends {
    id: Int
    friend_id: Int
  }

  type Messages {
    id: Int
    friend_id: Int
    Message: String
    date_sent: Int
    user_id: Int
    receiver_id: Int
  }

  type StandardResponse {
    response: String!
  }

  type SignInResponse {
    id: Int
    first_name: String
    last_name: String
    email: String
    token: String
  }

  type SignUpResponse {
    response: String
    token: String
    user_id: Int
    first_name: String
    last_name: String
    email: String
  }

  type CreateGroupResponse {
    name: String
    response: String
    group_id: Int
    photo_url: String
    number_of_members: Int
  }
  type Query {
    getUser(user_id: Int): User
  }

  type Mutation {
    SignUp(
      first_name: String
      last_name: String
      email: String
      password: String
    ): SignUpResponse!
    SignIn(email: String, password: String): SignInResponse!
    CreateGroup(
      user_id: Int
      name: String
      photo_url: String
    ): CreateGroupResponse!
    JoinGroup(user_id: Int, group_id: Int): String!
    CreatePost(message: String, user_id: Int, group_id: Int): StandardResponse!
    DeletePost(post_id: Int): StandardResponse!
    AddComment(message: String, user_id: Int, post_id: Int): StandardResponse!
    LeaveGroup(user_id: Int, group_id: Int): StandardResponse!
    DeleteComment(
      user_id: Int
      post_id: Int
      comment_id: Int
    ): StandardResponse!
    ChangePassword(
      user_id: Int
      old_password: String
      new_password: String
    ): StandardResponse!
    DeleteGroup(group_id: Int): StandardResponse!
  }
`;

export default typeDefs;
