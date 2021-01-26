import express from 'express';
import ordersController from '../controllers/orders';
import authMiddleware from '../middlewares/authentication';
import ordersMiddleware from '../middlewares/orders';

const { placeOrder, getSpecificOrder } = ordersController;
const { checkUserToken } = authMiddleware;
const {
  validatePlaceOrder,
  validateGetOrder,
  findOrderById,
} = ordersMiddleware;

const ordersRoutes = express.Router();

ordersRoutes.post('/', validatePlaceOrder, checkUserToken, placeOrder);
ordersRoutes.get('/:id', validateGetOrder, checkUserToken, findOrderById, getSpecificOrder );

export default ordersRoutes;
