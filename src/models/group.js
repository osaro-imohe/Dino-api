"use strict";
const { Model } = require("sequelize");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: "User_Groups",
        as: "users",
        foreignKey: "id",
      }),
        Group.hasMany(models.Post, { foreignKey: "group_id" });
    }
  }
  Group.init(
    {
      name: DataTypes.STRING,
      number_of_members: DataTypes.INTEGER,
      photo_url: DataTypes.STRING,
      admin_user_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      invite_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
