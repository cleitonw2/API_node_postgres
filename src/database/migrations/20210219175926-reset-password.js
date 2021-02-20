'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'Users',
      'passwordResetToken',
      {
        type: DataTypes.STRING,
      },
    );

    await queryInterface.addColumn(
      'Users',
      'passwordResetExpires',
      {
        type: DataTypes.STRING,
      },
    );
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn(
      'Users',
      'passwordResetToken',
    );

    await queryInterface.removeColumn(
      'Users',
      'passwordResetExpires',
    );
  }
};
