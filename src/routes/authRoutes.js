import express from 'express';
import authController from '../controllers/authentication';
import authMiddleware from '../middlewares/authentication';

const { signUp, verify, resendOTP } = authController;
const {
  validateSignup,
  isUserRegistered,
  validateVerifyOTP,
  checkUserToken,
  checkOTP,
} = authMiddleware;

const authRoutes = express.Router();

authRoutes.post('/signup', validateSignup, isUserRegistered, signUp);
authRoutes.get('/verify', validateVerifyOTP, checkUserToken, checkOTP, verify);
authRoutes.get('/verify/retry', checkUserToken, resendOTP);

export default authRoutes;
