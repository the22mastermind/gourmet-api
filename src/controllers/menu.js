import statusCodes from '../utils/statusCodes';
import misc from '../helpers/misc';

const {
  serverError,
  success,
} = statusCodes;
const {
  successResponse,
  errorResponse,
} = misc;

/**
 * @description Class to handle the creation, retrieval and updating of orders
 */
export default class Menu {
  /**
   * @description method that returns the menu items
   * @param {object} req
   * @param {object} res
   * @returns {object} Success | error response object
   */
  static getMenuItems = async (req, res) => {
    try {
      return successResponse(res, success, null, null, req.menuItems);
    } catch (error) {
      return errorResponse(res, serverError, error);
    }
  };
}
