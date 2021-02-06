module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Items', [
      {
        menuId: 1,
        name: 'French Omelette De Fromage',
        description: 'Our famous Omelette De Fromage with lots of Cheese.',
        cost: 4.00,
        size: 'Medium',
        image: 'https://media.istockphoto.com/photos/omelette-picture-id155375267',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menuId: 2,
        name: 'Double Cheese Burger',
        description: 'This is a very tasty cheese burger.',
        cost: 6.50,
        size: 'Large',
        image: 'https://media.istockphoto.com/photos/delicious-fresh-cooked-burger-with-a-side-of-french-fries-picture-id177556385',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menuId: 2,
        name: 'Chicken Pizza',
        description: 'This is a very tasty Pizza.',
        cost: 9.00,
        size: 'Large',
        image: 'https://media.istockphoto.com/photos/delicious-vegetarian-pizza-on-white-picture-id1192094401',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menuId: 3,
        name: 'Diet Coke',
        description: 'Diet Coke without added sugar.',
        cost: 1.50,
        size: 'Small',
        image: 'https://media.istockphoto.com/photos/can-of-cocacola-on-ice-picture-id487787108',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menuId: 3,
        name: 'Cappucinno',
        description: 'The best Cappucinno in town.',
        cost: 1.50,
        size: 'Medium',
        image: 'https://www.istockphoto.com/photo/3d-paper-coffee-cup-and-lid-isolated-on-white-gm1165889671-320956287',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});
  },
};
