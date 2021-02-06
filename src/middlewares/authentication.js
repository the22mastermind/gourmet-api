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

/**
 * @description Wrapper function that exposes signup validation errors
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns {function} returnErrorMessages function
 */
const validateSignup = async (req, res, next) => {
  const { error } = signup(req.body);
  returnErrorMessages(error, res, next);
};

/**
 * @description Checks if the phoneNumber is registered and returns a conflict error
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error message or  executes the next callback
 */
const isUserRegistered = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const condition = { phoneNumber };
  const user = await findByCondition(User, condition);
  if (user) {
    return errorResponse(res, conflict, signupConflict);
  }
  return next();
};

/**
 * @description Wrapper function that exposes verifyOTP validation errors
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns {function} returnErrorMessages function
 */
const validateVerifyOTP = async (req, res, next) => {
  const { error } = verifyOTP(req.body);
  returnErrorMessages(error, res, next);
};

/**
 * @description Checks if the token in headers is valid, user exists, and user has not logged out
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error message or  executes the next callback
 */
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

/**
 * @description Checks if the submitted OTP matches the user's OTP saved in the database
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error message or  executes the next callback
 */
const checkOTP = async (req, res, next) => {
  const { otp } = req.body;
  const userOTP = req.userData.otp;
  if (otp !== userOTP) {
    return errorResponse(res, forbidden, wrongOTP);
  }
  return next();
};

/**
 * @description Wrapper function that exposes login validation errors
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns {function} returnErrorMessages function
 */
const validateLogin = async (req, res, next) => {
  const { error } = login(req.body);
  returnErrorMessages(error, res, next);
};

/**
 * @description Checks if the user exists and if the submitted credentials are correct
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error message or  executes the next callback
 */
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

/**
 * @description Checks if the user making the request is an admin
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error message or  executes the next callback
 */
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
