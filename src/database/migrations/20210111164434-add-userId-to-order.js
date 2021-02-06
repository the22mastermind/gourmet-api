module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'userId');
  },
};
