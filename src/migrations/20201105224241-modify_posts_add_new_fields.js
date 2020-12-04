"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Posts", // table name
        "number_of_likes", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Posts", // table name
        "number_of_comments", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Posts", "number_of_likes"),
      queryInterface.removeColumn("Posts", "number_of_comments"),
    ]);
  },
};
