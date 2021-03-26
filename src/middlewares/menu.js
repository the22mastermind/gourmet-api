import _ from 'lodash';
import helpers from '../helpers/misc';
import models from '../database/models';
import services from '../services/services';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';

const { errorResponse } = helpers;
const { Menu, Item } = models;
const { findMenuItems } = services;
const { notFound, serverError } = statusCodes;
const { menuNotFound } = messages;

/**
 * @description Retrieves the menu or returns an error response
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {function} next Callback function
 */
const findMenu = async (req, res, next) => {
  try {
    const menu = await findMenuItems(Menu, Item);
    if (_.isEmpty(menu)) {
      return errorResponse(res, notFound, menuNotFound);
    }
    req.menuItems = menu;
    return next();
  } catch (error) {
    return errorResponse(res, serverError, error);
  }
};

export default { findMenu };
