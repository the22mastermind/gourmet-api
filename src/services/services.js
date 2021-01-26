const saveData = async (model, obj) => {
  const data = await model.create(obj);
  return data.dataValues;
};

const findByCondition = async (model, condition) => {
  const data = await model.findOne(
    {
      where: condition,
      include: [{ all: true }],
    });
  return data;
};

const updateByCondition = async (model, data, condition) => {
  const updated = await model.update(data,
    {
      where: condition,
      returning: true,
      plain: true,
    });
  return updated[1];
};

const saveManyRows = async (model, obj) => {
  const data = await model.bulkCreate(obj);
  return data;
};

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
    });
  return data;
};

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
    });
  return data;
};

export default {
  saveData,
  findByCondition,
  updateByCondition,
  saveManyRows,
  findOrderByConditionAll,
  findAllOrders,
};
