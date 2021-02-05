import express from 'express';
import ordersController from '../controllers/orders';
import authMiddleware from '../middlewares/authentication';
import ordersMiddleware from '../middlewares/orders';

const { getSpecificOrder, getOrdersList, updateOrder } = ordersController;
const { checkUserToken, checkAdminRole } = authMiddleware;
const {
  validateGetOrder,
  findOrderById,
  findOrdersList,
  validateUpdateOrder,
  checkOrderStatus,
} = ordersMiddleware;

const adminRoutes = express.Router();

adminRoutes.get('/orders/:id', validateGetOrder, checkUserToken, checkAdminRole, findOrderById, getSpecificOrder);
adminRoutes.get('/orders', checkUserToken, checkAdminRole, findOrdersList, getOrdersList);
adminRoutes.patch(
  '/orders/:id',
  validateGetOrder,
  validateUpdateOrder,
  checkUserToken,
  checkAdminRole,
  findOrderById,
  checkOrderStatus,
  updateOrder,
);

export default adminRoutes;
