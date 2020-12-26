import Joi from 'joi';
import messages from '../utils/messages';

const createErrorMessages = (type, empty, min, max, pattern) => ({
  [`${type}.empty`]: empty,
  [`${type}.format`]: pattern,
  [`${type}.min`]: min,
  [`${type}.max`]: max,
  [`${type}.pattern.base`]: pattern,
  'any.required': empty,
});

const signup = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().regex(/^([a-zA-Z]{3,30})+$/).required().messages(createErrorMessages(
      'string',
      `${messages.emptyFirstName}`,
      `${messages.minFirstName}`,
      `${messages.maxFirstName}`,
      `${messages.invalidFirstName}`,
    )),
    lastName: Joi.string().regex(/^([a-zA-Z]{3,30})+$/).required().messages(createErrorMessages(
      'string',
      `${messages.emptyLastName}`,
      `${messages.minLastName}`,
      `${messages.maxLastName}`,
      `${messages.invalidLastName}`,
    )),
    phoneNumber: Joi.string().regex(/^[+]+([0-9]{11,12})$/).required().messages(createErrorMessages(
      'string',
      `${messages.emptyPhone}`,
      `${messages.invalidPhone}`,
      `${messages.invalidPhone}`,
      `${messages.invalidPhone}`,
    )),
    address: Joi.string().required().messages(createErrorMessages(
      'string',
      `${messages.emptyAddress}`,
      `${messages.emptyAddress}`,
      `${messages.emptyAddress}`,
      `${messages.emptyAddress}`,
    )),
    password: Joi.string().regex(/^(?=.*[!@#$%^&*?])[0-9a-zA-Z!@#$%^&*?]{6,20}$/).required().messages(createErrorMessages(
      'string',
      `${messages.emptyPassword}`,
      `${messages.minPassword}`,
      `${messages.maxPassword}`,
      `${messages.invalidPassword}`,
    )),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

const verifyOTP = (data) => {
  const schema = Joi.object({
    otp: Joi.string().regex(/^([0-9]{6})+$/).required().messages(createErrorMessages(
      'string',
      `${messages.emptyOTP}`,
      `${messages.invalidOTP}`,
      `${messages.invalidOTP}`,
      `${messages.invalidOTP}`,
    )),
  });
  return schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
};

export default {
  signup,
  verifyOTP,
};
