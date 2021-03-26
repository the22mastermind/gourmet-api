/**
 * @description Saves a new record in a model
 * @param {string} model Model to save into
 * @param {object} obj Data object to save
 * @returns {object} Data object saved
 */
const saveData = async (model, obj) => {
  const data = await model.create(obj);
  return data.dataValues;
};

/**
 * @description Gets a single record with all its related data by a condition
 * @param {string} model Model to search
 * @param {object} condition Condition to use
 * @returns {object} data object with nested info
 */
const findByCondition = async (model, condition) => {
  const data = await model.findOne(
    {
      where: condition,
      include: [{ all: true }],
    },
  );
  return data;
};

/**
 * @description Updates a model by a condition
 * @param {string} model Model to update
 * @param {object} data Data to update
 * @param {object} condition Condition to use
 * @returns {array} updated data
 */
const updateByCondition = async (model, data, condition) => {
  const updated = await model.update(data,
    {
      where: condition,
      returning: true,
      plain: true,
    });
  return updated[1];
};

/**
 * @description Saves multiple rows at the same time
 * @param {string} model Model to save into
 * @param {array} obj Array of objects to save
 * @returns {array} data saved
 */
const saveManyRows = async (model, obj) => {
  const data = await model.bulkCreate(obj);
  return data;
};

/**
 * @description Gets a single order with its contents and user info by a condition
 * @param {string} model Order model
 * @param {object} condition Condition to use
 * @param {string} contents Contents model
 * @param {string} user User model
 * @returns {object} data
 */
const findOrderByConditionAll = async (model, condition, contents, user) => {
  const data = await model.findOne(
    {
      where: condition,
      include: [
        { model: contents },
        {
          model: user,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'phoneNumber',
            'address',
          ],
        },
      ],
    },
  );
  return data;
};

/**
 * @description Gets all the orders with their contents and user info
 * @param {string} model Order model
 * @param {string} contents Contents model
 * @param {string} user User model
 * @returns {array} data
 */
const findAllOrders = async (model, contents, user) => {
  const data = await model.findAll(
    {
      order: [
        ['id', 'DESC'],
      ],
      include: [
        { model: contents },
        {
          model: user,
          attributes: [
            'id',
            'firstName',
            'lastName',
            'phoneNumber',
            'address',
            'createdAt',
          ],
        },
      ],
    },
  );
  return data;
};

/**
 * @description Gets all the orders of a specific user with their contents info
 * @param {string} model Order model
 * @param {string} contents Contents model
 * @param {object} condition Object with condition eg. { id: 1 }
 * @returns {array} data
 */
const findAllUserOrders = async (model, contents, condition) => {
  const data = await model.findAll(
    {
      where: condition,
      order: [
        ['id', 'DESC'],
      ],
      include: [
        { model: contents },
      ],
    },
  );
  return data;
};

/**
 * @description Gets the menu categories and menu items
 * @param {string} model Menu model
 * @param {string} model Items model
 * @returns {array} data
 */
const findMenuItems = async (model, items) => {
  const data = await model.findAll(
    {
      include: [
        { model: items },
      ],
    },
  );
  return data;
};

export default {
  saveData,
  findByCondition,
  updateByCondition,
  saveManyRows,
  findOrderByConditionAll,
  findAllOrders,
  findAllUserOrders,
  findMenuItems,
};
