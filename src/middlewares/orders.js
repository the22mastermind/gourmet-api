import orders from '../validations/orders';
import helpers from '../helpers/misc';

const { placeOrder } = orders;
const {
  returnErrorMessages,
} = helpers;

const validatePlaceOrder = async (req, res, next) => {
  const { error } = placeOrder(req.body);
  returnErrorMessages(error, res, next);
};

export default {
  validatePlaceOrder,
};
