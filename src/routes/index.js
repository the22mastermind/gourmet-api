import express from 'express';
import authRoutes from './authRoutes';
import ordersRoutes from './ordersRoutes';
import adminRoutes from './adminRoutes';

const routes = express.Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/orders', ordersRoutes);
routes.use('/api/admin', adminRoutes);

export default routes;
