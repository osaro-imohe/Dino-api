"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: "user_id" }),
        Post.belongsTo(models.Group, { foreignKey: "group_id" }),
        Post.hasMany(models.Comment, { foreignKey: "post_id" });
    }
  }
  Post.init(
    {
      message: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      group_id: DataTypes.INTEGER,
      number_of_likes: DataTypes.INTEGER,
      number_of_comments: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
