'use strict';

import roles from '../../utils/roles';

const {CUSTOMER, STAFF, ADMIN} = roles;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role',
    {
      allowNull: false,
      type: Sequelize.ENUM(CUSTOMER, STAFF, ADMIN),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
  }
};
