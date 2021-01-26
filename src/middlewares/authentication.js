import jwt from 'jsonwebtoken';
import authentication from '../validations/authentication';
import helpers from '../helpers/misc';
import models from '../database/models';
import services from '../services/services';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import redisClient from '../config/redisConfig';
import roles from '../utils/roles';

const { signup, verifyOTP, login } = authentication;
const {
  returnErrorMessages,
  errorResponse,
  isPasswordValid,
} = helpers;
const { User } = models;
const { findByCondition } = services;
const {
  conflict,
  forbidden,
  badRequest,
  notFound,
  unauthorized,
  serverError,
} = statusCodes;
const {
  signupConflict,
  wrongOTP,
  invalidRequest,
  invalidToken,
  loginUserNotFound,
  loginUserWrongCredentials,
  adminOnlyResource,
} = messages;
const { ADMIN } = roles;

const validateSignup = async (req, res, next) => {
  const { error } = signup(req.body);
  returnErrorMessages(error, res, next);
};

const isUserRegistered = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const condition = { phoneNumber };
  const user = await findByCondition(User, condition);
  if (user) {
    return errorResponse(res, conflict, signupConflict);
  }
  return next();
};

const validateVerifyOTP = async (req, res, next) => {
  const { error } = verifyOTP(req.body);
  returnErrorMessages(error, res, next);
};

const checkUserToken = async (req, res, next) => {
  let token = req.get('authorization');
  if (!token) {
    return errorResponse(res, badRequest, invalidRequest);
  }
  try {
    token = token.split(' ').pop();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { phoneNumber } = decodedToken;
    const condition = { phoneNumber };
    const userData = await findByCondition(User, condition);
    return redisClient.smembers('token', async (err, tokensArray) => {
      if (err) {
        return errorResponse(res, serverError, err.message);
      }
      if (tokensArray.includes(token, 0) || !userData) {
        return errorResponse(res, unauthorized, invalidToken);
      }
      req.userData = userData.dataValues;
      return next();
    });
  } catch (error) {
    return errorResponse(res, badRequest, invalidToken);
  }
};

const checkOTP = async (req, res, next) => {
  const { otp } = req.body;
  const userOTP = req.userData.otp;
  if (otp !== userOTP) {
    return errorResponse(res, forbidden, wrongOTP);
  }
  return next();
};

const validateLogin = async (req, res, next) => {
  const { error } = login(req.body);
  returnErrorMessages(error, res, next);
};

const checkLogin = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const condition = { phoneNumber };
    const userData = await findByCondition(User, condition);
    if (!userData) {
      return errorResponse(res, notFound, loginUserNotFound);
    }
    const dbPassword = userData.dataValues.password;
    const passwordsMatch = await isPasswordValid(password, dbPassword);
    if (!passwordsMatch) {
      return errorResponse(res, unauthorized, loginUserWrongCredentials);
    }
    req.userData = userData.dataValues;
    return next();
  } catch (error) {
    return errorResponse(res, unauthorized, loginUserWrongCredentials);
  }
};

const checkAdminRole = async (req, res, next) => {
  try {
    const { role } = req.userData;
    if (role !== ADMIN) {
      return errorResponse(res, unauthorized, adminOnlyResource);
    }
    return next();
  } catch (error) {
    return errorResponse(res, unauthorized, loginUserWrongCredentials);
  }
};

export default {
  validateSignup,
  isUserRegistered,
  validateVerifyOTP,
  checkUserToken,
  checkOTP,
  validateLogin,
  checkLogin,
  checkAdminRole,
};
