import jwt from 'jsonwebtoken';
import authentication from '../validations/authentication';
import helpers from '../helpers/misc';
import models from '../database/models';
import services from '../services/services';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';

const { signup, verifyOTP } = authentication;
const { returnErrorMessages, errorResponse } = helpers;
const { User } = models;
const { findByCondition } = services;
const { conflict, forbidden } = statusCodes;
const { signupConflict, wrongOTP } = messages;

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
    return errorResponse(res, statusCodes.badRequest, messages.invalidRequest);
  }
  try {
    token = token.split(' ').pop();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { phoneNumber } = decodedToken;
    const condition = { phoneNumber };
    const userData = await findByCondition(User, condition);
    req.userData = userData.dataValues;
    return next();
  } catch (error) {
    return errorResponse(res, statusCodes.badRequest, messages.invalidToken);
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

export default {
  validateSignup,
  isUserRegistered,
  validateVerifyOTP,
  checkUserToken,
  checkOTP,
};
