import _ from 'lodash';
import statusCodes from '../utils/statusCodes';
import messages from '../utils/messages';
import misc from '../helpers/misc';
import services from '../services/services';
import models from '../database/models';

const {
  created,
  serverError,
  success,
} = statusCodes;
const { orderSuccess } = messages;
const {
  successResponse,
  errorResponse,
  parseOrderContents,
} = misc;
const { saveData, saveManyRows } = services;
const { Order, Contents } = models;

export default class Orders {
  static placeOrder = async (req, res) => {
    try {
      const { total, contents, paymentId } = req.body;
      const orderObject = {
        userId: req.userData.id,
        total,
        status: 'pending',
        paymentId,
      };
      const orderData = await saveData(Order, orderObject);
      const orderId = orderData.id;
      const orderContentsData = await parseOrderContents(contents, orderId);
      await saveManyRows(Contents, orderContentsData);
      return successResponse(res, created, orderSuccess, null, orderData);
    } catch (error) {
      return errorResponse(res, serverError, error);
    }
  };

  static getSpecificOrder = async (req, res) => {
    try {
      return successResponse(res, success, null, null, req.orderData);
    } catch (error) {
      return errorResponse(res, serverError, error);
    }
  };

  static getOrdersList = async (req, res) => {
    try {
      return successResponse(res, success, null, null, req.ordersList);
    } catch (error) {
      return errorResponse(res, serverError, error);
    }
  };
};
