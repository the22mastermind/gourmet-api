import express from 'express';
import authRoutes from './authRoutes';

const routes = express.Router();

routes.use('/api/auth', authRoutes);

export default routes;
