import express from 'express';
import ordersController from '../controllers/orders';
import authMiddleware from '../middlewares/authentication';
import ordersMiddleware from '../middlewares/orders';

const { placeOrder } = ordersController;
const { checkUserToken } = authMiddleware;
const { validatePlaceOrder } = ordersMiddleware;

const ordersRoutes = express.Router();

ordersRoutes.post('/', validatePlaceOrder, checkUserToken, placeOrder);

export default ordersRoutes;
