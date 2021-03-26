import express from 'express';
import authMiddleware from '../middlewares/authentication';
import paymentsMiddleware from '../middlewares/payments';

const { checkUserToken } = authMiddleware;
const { validateInitiatePayment, generatePaymentIntent } = paymentsMiddleware;

const paymentsRoutes = express.Router();

paymentsRoutes.post('/', validateInitiatePayment, checkUserToken, generatePaymentIntent);

export default paymentsRoutes;
