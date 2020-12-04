const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: Int
    first_name: String
    last_name: String
    email: String
    profile_picture_url: String
  }

  type Comment {
    id: Int
    message: String
    post_id: Int
    User: User
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

  type Post {
    id: Int
    message: String
    user_id: Int
    group_id: Int
    image_url: String
    number_of_likes: Int
    number_of_comments: Int
    createdAt: String
    User: User
  }

  type Group {
    id: Int
    name: String
    photo_url: String
    invite_code: String
    admin_user_id: Int
    description: String
    number_of_members: Int
  }

  type SignInResponse {
    response: String
    user_id: Int
    first_name: String
    last_name: String
    email: String
    profile_picture_url: String
    token: String
  }

  type SignUpResponse {
    response: String
    token: String
    user_id: Int
    first_name: String
    last_name: String
    profile_picture_url: String
    email: String
  }

  type StandardResponse {
    response: String
  }

  type CreatePostResponse {
    response: String
    posts: Post
  }

  type CreateGroupResponse {
    response: String
    groups: Group
  }

  type GetGroupResponse {
    response: String
    groups: [Group]
  }

  type JoinGroupResponse {
    response: String
    groups: Group
  }

  type GetPostsResponse {
    posts: [Post]
  }

  type Query {
    GetUser(user_id: Int): User
    GetPosts(group_id: Int, referencePostId: Int, reference: String): GetPostsResponse
    GetGroups(user_id: Int): GetGroupResponse
    GetComments(post_id: Int, referenceCommentId: Int, reference: String): [Comment]
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
    JoinGroup(user_id: Int, invite_code: String): JoinGroupResponse!
    CreatePost(
      message: String
      user_id: Int
      group_id: Int
      image_url: String
    ): CreatePostResponse!
    LikePost(post_id: Int): String!
    DeletePost(post_id: Int): StandardResponse!
    CreateComment(
      message: String
      user_id: Int
      post_id: Int
    ): Comment!
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
