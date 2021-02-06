import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import statusCodes from '../utils/statusCodes';
import twilioConfig from '../config/twilioConfig';

const { client } = twilioConfig;

/**
 * @description Returns a successful response
 * @param {object} res Response object
 * @param {number} statusCode Status code number
 * @param {string} message Message text
 * @param {string} token Token string if any
 * @param {object} data Data object if any
 * @returns {object} JSON response
 */
const successResponse = (res, statusCode, message, token, data) => res.status(statusCode).json({
  message,
  token,
  data,
});

/**
 * @description Returns an error response
 * @param {object} res Response object
 * @param {number} statusCode Status code number
 * @param {string} error Message text
 * @returns {object} JSON response
 */
const errorResponse = (res, statusCode, error) => res.status(statusCode).json({ error });

/**
 * @description Returns an array of parsed validation errors if any or executes next callback
 * @param {object} errors Errors object
 * @param {object} res Response object
 * @param {function} next Callback function
 * @returns JSON error response or executes next callback
 */
const returnErrorMessages = (errors, res, next) => {
  if (errors) {
    const { details } = errors;
    const errorMessages = details.map((error) => error.message.replace(/['"]/g, '')).join(', ');
    return errorResponse(res, statusCodes.badRequest, errorMessages);
  }
  return next();
};

/**
 * @description Generates a JWT token that will expire in 30 days
 * @param {object} data Data to sign in the token
 * @returns {string} Token string
 */
const generateToken = async (data) => {
  const token = jwt.sign(
    data,
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30d',
    },
  );
  return token;
};

/**
 * @description Generates a random 6-digit number
 * @returns {number} otp code
 */
const generateOTP = async () => {
  const otp = Math.floor(100000 + (Math.random() * 900000));
  return otp;
};

/**
 * @description Sends an SMS using Twilio client
 * @param {string} phone Phone number to send OTP to
 * @param {string} message Message text to send
 */
const sendOTP = async (phone, message) => {
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_FROM_NUMBER,
    to: phone,
  });
};

/**
 * @description Generates a hashed password from a plain-text one
 * @param {string} password Plain-text password to hash
 * @returns {string} Hashed password string
 */
const generateHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

/**
 * @description Check if the plain-text password matches the hashed version
 * @param {string} password Plain-text password
 * @param {string} dbPassword Hashed password string from the database
 * @returns {boolean} true or false
 */
const isPasswordValid = async (password, dbPassword) => {
  const isValid = await bcrypt.compare(password, dbPassword);
  return isValid;
};

/**
 * @description Adds the orderId property to each item object in contents array
 * @param {array} contents Array of item objects
 * @param {number} orderId Order id
 * @returns {array} Array of item objects with each item having a orderId property
 */
const parseOrderContents = async (contents, orderId) => {
  const contentsWithOrderId = [];
  contents.forEach((item) => {
    const itemData = {
      ...item,
      orderId,
    };
    contentsWithOrderId.push(itemData);
  });
  return contentsWithOrderId;
};

export default {
  returnErrorMessages,
  successResponse,
  errorResponse,
  generateToken,
  generateOTP,
  sendOTP,
  generateHashedPassword,
  isPasswordValid,
  parseOrderContents,
};
