import express from 'express';
import authRoutes from './authRoutes';
import ordersRoutes from './ordersRoutes';
import adminRoutes from './adminRoutes';
import menuRoutes from './menuRoutes';
import paymentsRoutes from './paymentsRoutes';

const routes = express.Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/orders', ordersRoutes);
routes.use('/api/admin', adminRoutes);
routes.use('/api/menu', menuRoutes);
routes.use('/api/payments', paymentsRoutes);

export default routes;
