import express from 'express';
import authRoutes from './authRoutes';
import ordersRoutes from './ordersRoutes';

const routes = express.Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/orders', ordersRoutes);

export default routes;
