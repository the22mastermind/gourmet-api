import Joi from 'joi';
import messages from '../utils/messages';
import authentication from './authentication';

const { createErrorMessages } = authentication;

const orderContents = {
  itemId: Joi.number().positive().required().messages(
    createErrorMessages(
      'number',
      `${messages.emptyItemId}`,
      `${messages.invalidItemId}`,
      `${messages.invalidItemId}`,
      `${messages.invalidItemId}`,
    ),
  ),
  itemName: Joi.string().required().messages(
    createErrorMessages(
      'string',
      `${messages.emptyItemName}`,
      null,
      null,
      null,
    ),
  ),
  cost: Joi.number().min(1).precision(1).required()
    .messages(
      createErrorMessages(
        'number',
        `${messages.emptyItemCost}`,
        `${messages.invalidItemCost}`,
        null,
        `${messages.invalidItemCost}`,
      ),
    ),
  quantity: Joi.number().min(1).positive().required()
    .messages(createErrorMessages(
      'number',
      `${messages.emptyItemQuantity}`,
      `${messages.invalidItemQuantity}`,
      null,
      `${messages.invalidItemQuantity}`,
    )),
};

/**
 * @description Validates the total, contents, and paymentId properties of req.body
 * @param {object} data
 * @returns {object} Validation result object
 */
const placeOrder = (data) => {
  const schema = Joi.object({
    total: Joi.number().min(1).precision(1).required()
      .messages(createErrorMessages(
        'number',
        `${messages.emptyTotal}`,
        `${messages.invalidTotal}`,
        `${messages.invalidTotal}`,
        `${messages.invalidTotal}`,
      )),
    contents: Joi.array().items(orderContents).min(1).ordered(orderContents)
      .required()
      .messages(createErrorMessages(
        'array',
        `${messages.orderEmpty}`,
        `${messages.orderEmpty}`,
        null,
        `${messages.orderEmpty}`,
      )),
    paymentId: Joi.string().required().messages(createErrorMessages(
      'string',
      `${messages.emptyPaymentId}`,
      `${messages.invalidPaymentId}`,
      `${messages.invalidPaymentId}`,
      `${messages.invalidPaymentId}`,
    )),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

/**
 * @description Validates the id parameter of req.params
 * @param {object} data
 * @returns {object} Validation result object
 */
const getOrder = (data) => {
  const schema = Joi.object({
    id: Joi.number().positive().required().messages(createErrorMessages(
      'number',
      `${messages.missingId}`,
      `${messages.invalidId}`,
      `${messages.invalidId}`,
      `${messages.invalidId}`,
    )),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

/**
 * @description Validates if the status property of is one of (accepted, onthemove, or completed
 * @param {object} data
 * @returns {object} Validation result object
 */
const updateOrder = (data) => {
  const schema = Joi.object({
    status: Joi.string().regex(/^(accepted|onthemove|completed)$/).required().messages(createErrorMessages(
      'string',
      `${messages.orderUpdateEmptyStatus}`,
      `${messages.orderUpdateInvalidStatus}`,
      `${messages.orderUpdateInvalidStatus}`,
      `${messages.orderUpdateInvalidStatus}`,
    )),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  placeOrder,
  getOrder,
  updateOrder,
};
