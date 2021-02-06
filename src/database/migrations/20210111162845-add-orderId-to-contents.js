module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Contents', 'orderId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        references: {
          model: 'Orders',
          key: 'id',
        },
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Contents', 'orderId');
  },
};
