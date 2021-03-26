import express from 'express';
import ordersController from '../controllers/orders';
import authMiddleware from '../middlewares/authentication';
import ordersMiddleware from '../middlewares/orders';

const { placeOrder, getSpecificOrder, getOrdersList } = ordersController;
const { checkUserToken } = authMiddleware;
const {
  validatePlaceOrder,
  validateGetOrder,
  findUserOrderById,
  findOrdersList,
} = ordersMiddleware;

const ordersRoutes = express.Router();

ordersRoutes.post('/', validatePlaceOrder, checkUserToken, placeOrder);
ordersRoutes.get('/:id', validateGetOrder, checkUserToken, findUserOrderById, getSpecificOrder);
ordersRoutes.get('/', checkUserToken, findOrdersList, getOrdersList);

export default ordersRoutes;
