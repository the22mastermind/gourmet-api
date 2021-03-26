import express from 'express';
import menuController from '../controllers/menu';
import authMiddleware from '../middlewares/authentication';
import menuMiddleware from '../middlewares/menu';

const { getMenuItems } = menuController;
const { checkUserToken } = authMiddleware;
const { findMenu } = menuMiddleware;

const menuRoutes = express.Router();

menuRoutes.get('/', checkUserToken, findMenu, getMenuItems);

export default menuRoutes;
