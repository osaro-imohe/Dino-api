"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Groups", // table name
        "invite_code", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Groups", // table name
        "number_of_members", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Groups", // table name
        "photo_url", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Groups", // table name
        "description", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Groups", // table name
        "admin_user_id", // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "invite_code"),
      queryInterface.removeColumn("Users", "number_of_members"),
      queryInterface.removeColumn("Users", "photo_url"),
      queryInterface.removeColumn("Users", "description"),
      queryInterface.removeColumn("Users", "admin_user_id"),
    ]);
  },
};
