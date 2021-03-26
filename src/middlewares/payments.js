import payments from '../validations/payments';
import helpers from '../helpers/misc';
import statusCodes from '../utils/statusCodes';
import stripeConfig from '../config/stripeConfig';

const {
  returnErrorMessages,
  errorResponse,
  successResponse,
} = helpers;
const {
  success,
  serverError,
} = statusCodes;
const { initiatePayment } = payments;

/**
 * @description Wrapper function that exposes initiatePayment validation errors
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 */
const validateInitiatePayment = async (req, res, next) => {
  const { error } = initiatePayment(req.body);
  returnErrorMessages(error, res, next);
};

/**
 * @description Generates a payment intent to be confirmed on frontend
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns error message or JSON object containing publishableKey and clientSecret properties
 */
const generatePaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripeConfig.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    const data = {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      clientSecret: paymentIntent.client_secret,
    };
    return successResponse(res, success, null, null, data);
  } catch (error) {
    return errorResponse(res, serverError, error.message);
  }
};

export default {
  validateInitiatePayment,
  generatePaymentIntent,
};
