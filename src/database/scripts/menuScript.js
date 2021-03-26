import models from '../models';

const { Menu, Item } = models;

/**
 * @description Clears the menu records
 */
const clearMenu = async () => {
  await models.sequelize.query('DELETE FROM "Items";');
  await models.sequelize.query('DELETE FROM "Menus";');
};

/**
 * @description Creates the menu items
 */
const createItems = async (id, name) => {
  switch (name) {
    case 'Breakfast':
      await Item.create({
        menuId: id,
        name: 'French Omelette De Fromage',
        description: 'Our famous Omelette De Fromage with lots of Cheese.',
        cost: 4.00,
        size: 'Medium',
        image: 'https://media.istockphoto.com/photos/omelette-picture-id155375267',
      });
      break;
    case 'Lunch/Dinner':
      await Item.create({
        menuId: id,
        name: 'Double Cheese Burger',
        description: 'This is a very tasty cheese burger.',
        cost: 6.50,
        size: 'Large',
        image: 'https://media.istockphoto.com/photos/delicious-fresh-cooked-burger-with-a-side-of-french-fries-picture-id177556385',
      });
      await Item.create({
        menuId: id,
        name: 'Chicken Pizza',
        description: 'This is a very tasty Pizza.',
        cost: 9.00,
        size: 'Large',
        image: 'https://media.istockphoto.com/photos/delicious-vegetarian-pizza-on-white-picture-id1192094401',
      });
      break;
    case 'Drinks':
      await Item.create({
        menuId: id,
        name: 'Diet Coke',
        description: 'Diet Coke without added sugar.',
        cost: 1.50,
        size: 'Small',
        image: 'https://media.istockphoto.com/photos/can-of-cocacola-on-ice-picture-id487787108',
      });
      await Item.create({
        menuId: id,
        name: 'Cappucinno',
        description: 'The best Cappucinno in town.',
        cost: 1.50,
        size: 'Medium',
        image: 'https://media.istockphoto.com/photos/paper-coffee-cup-and-lid-isolated-on-white-picture-id1165889671?s=612x612',
      });
      break;
    default:
      break;
  }
};

/**
 * @description Creates the menu categories
 */
const createCategories = async () => {
  const categoriesData = [
    { name: 'Breakfast' },
    { name: 'Lunch/Dinner' },
    { name: 'Drinks' },
  ];
  categoriesData.forEach(async (category) => {
    const menu = await Menu.findOrCreate({
      where: { name: category.name },
      defaults: category,
    });
    const { id, name } = menu[0];
    await createItems(id, name);
  });
};

/**
 * @description Clears and creates menu categories and their items
 */
const createMenu = async () => {
  await clearMenu();
  await createCategories();
};

createMenu();

export default createMenu;
