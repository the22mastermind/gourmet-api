import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  badRequest,
  success,
  created,
  notFound,
  conflict,
} = statusCodes;
const {
  loginSuccessful,
  orderEmpty,
  orderSuccess,
  emptyTotal,
  emptyItemCost,
  invalidRequest,
  invalidId,
  orderNotFound,
  ordersListNotFound,
  orderUpdateSuccess,
  orderUpdateConflict,
  orderUpdateInvalidStatus,
  orderUpdateEmptyStatus,
} = messages;
const baseUrl = '/api/orders';
const adminUrl = '/api/admin/orders';

chai.use(chaiHttp);
chai.should();

let userToken = null;
let adminToken = null;

describe('ADMIN GET UNEXISTANT ORDER', () => {
  it('Valid admin login should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        phoneNumber: process.env.ADMIN_PHONE,
        password: process.env.ADMIN_PASSWORD,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        adminToken = token;
        done();
      });
  });
  it('Order not found should return 404', (done) => {
    chai
      .request(server)
      .get(`${adminUrl}/100`)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(orderNotFound);
        done();
      });
  });
});

describe('ADMIN GET EMPTY LIST OF ORDERS', () => {
  it('Orders list not found should return 404', (done) => {
    chai
      .request(server)
      .get(adminUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(ordersListNotFound);
        done();
      });
  });
});

describe('USER GET EMPTY LIST OF ORDERS', () => {
  it('Valid login should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        password: '@1helloworld',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        userToken = token;
        done();
      });
  });
  it('Orders list not found should return 404', (done) => {
    chai
      .request(server)
      .get(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(ordersListNotFound);
        done();
      });
  });
});

describe('CUSTOMER PLACE ORDER', () => {
  it('Valid login should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        password: '@1helloworld',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        userToken = token;
        done();
      });
  });
  it('Missing order contents should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 8.00,
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(orderEmpty);
        done();
      });
  });
  it('Invalid order contents should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 8.00,
        contents: [],
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(orderEmpty);
        done();
      });
  });
  it('Missing order total should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        contents: [
          {
            itemId: 2,
            itemName: 'Double Cheese Burger',
            cost: 6.50,
            quantity: 1,
          },
        ],
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(emptyTotal);
        done();
      });
  });
  it('Missing order item cost should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 6.50,
        contents: [
          {
            itemId: 2,
            itemName: 'Double Cheese Burger',
            quantity: 1,
          },
        ],
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(emptyItemCost);
        done();
      });
  });
  it('Missing token should return 401', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .send({
        total: 6.50,
        contents: [
          {
            itemId: 4,
            itemName: 'Diet Coke',
            cost: 1.50,
            quantity: 1,
          },
        ],
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(invalidRequest);
        done();
      });
  });
  it('Valid place order should return 201', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 8.00,
        contents: [
          {
            itemId: 2,
            itemName: 'Double Cheese Burger',
            cost: 6.50,
            quantity: 1,
          },
          {
            itemId: 4,
            itemName: 'Diet Coke',
            cost: 1.50,
            quantity: 1,
          },
        ],
        paymentId: '123456789',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(orderSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        expect(data.status).to.equal('pending');
        done();
      });
  });
});

describe('CUSTOMER GET ORDER', () => {
  it('Valid login should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        password: '@1helloworld',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        userToken = token;
        done();
      });
  });
  it('Invalid order id should return 400', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/hello$`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(invalidId);
        done();
      });
  });
  it('Unexistant order id should return 404', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/999`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(orderNotFound);
        done();
      });
  });
  it('Valid place order should return 201', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 21.00,
        contents: [
          {
            itemId: 5,
            itemName: 'Cappucinno',
            cost: 3.00,
            quantity: 2,
          },
          {
            itemId: 3,
            itemName: 'Chicken Pizza',
            cost: 18.00,
            quantity: 2,
          },
        ],
        paymentId: '123456799',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(orderSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        expect(data.status).to.equal('pending');
        done();
      });
  });
  it('Valid order found should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}/2`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('pending');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('Contents');
        expect(data.Contents).to.be.a('array');
        expect(data.Contents[0]).to.haveOwnProperty('itemId');
        expect(data.Contents[0]).to.haveOwnProperty('itemName');
        expect(data.Contents[0]).to.haveOwnProperty('cost');
        expect(data.Contents[0]).to.haveOwnProperty('quantity');
        expect(data).to.haveOwnProperty('User');
        expect(data.User).to.be.a('object');
        expect(data.User).to.haveOwnProperty('firstName');
        expect(data.User).to.haveOwnProperty('lastName');
        expect(data.User).to.haveOwnProperty('address');
        expect(data.User).to.haveOwnProperty('phoneNumber');
        done();
      });
  });
  it('Orders found should return 200', (done) => {
    chai
      .request(server)
      .get(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0].id).to.be.a('number');
        expect(data[0]).to.haveOwnProperty('total');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0].status).to.equal('pending');
        expect(data[0]).to.haveOwnProperty('paymentId');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('Contents');
        expect(data[0].Contents).to.be.a('array');
        expect(data[0].Contents[0]).to.haveOwnProperty('itemId');
        expect(data[0].Contents[0]).to.haveOwnProperty('itemName');
        expect(data[0].Contents[0]).to.haveOwnProperty('cost');
        expect(data[0].Contents[0]).to.haveOwnProperty('quantity');
        done();
      });
  });
});

describe('ADMIN GET ORDER', () => {
  it('Valid admin login should return 200', (done) => {
    chai
      .request(server)
      .post('/api/auth/login')
      .send({
        phoneNumber: process.env.ADMIN_PHONE,
        password: process.env.ADMIN_PASSWORD,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        adminToken = token;
        done();
      });
  });
  it('Valid order found should return 200', (done) => {
    chai
      .request(server)
      .get(`${adminUrl}/1`)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data.id).to.equal(1);
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('pending');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('Contents');
        expect(data.Contents).to.be.a('array');
        expect(data.Contents[0]).to.haveOwnProperty('itemId');
        expect(data.Contents[0]).to.haveOwnProperty('itemName');
        expect(data.Contents[0]).to.haveOwnProperty('cost');
        expect(data.Contents[0]).to.haveOwnProperty('quantity');
        expect(data).to.haveOwnProperty('User');
        expect(data.User).to.be.a('object');
        expect(data.User).to.haveOwnProperty('firstName');
        expect(data.User).to.haveOwnProperty('lastName');
        expect(data.User).to.haveOwnProperty('address');
        expect(data.User).to.haveOwnProperty('phoneNumber');
        done();
      });
  });
  it('Valid order found should return 200', (done) => {
    chai
      .request(server)
      .get(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data.id).to.equal(2);
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('pending');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        expect(data).to.haveOwnProperty('Contents');
        expect(data.Contents).to.be.a('array');
        expect(data.Contents[0]).to.haveOwnProperty('itemId');
        expect(data.Contents[0]).to.haveOwnProperty('itemName');
        expect(data.Contents[0]).to.haveOwnProperty('cost');
        expect(data.Contents[0]).to.haveOwnProperty('quantity');
        expect(data).to.haveOwnProperty('User');
        expect(data.User).to.be.a('object');
        expect(data.User).to.haveOwnProperty('firstName');
        expect(data.User).to.haveOwnProperty('lastName');
        expect(data.User).to.haveOwnProperty('address');
        expect(data.User).to.haveOwnProperty('phoneNumber');
        done();
      });
  });
});

describe('ADMIN GET LIST OF ORDERS', () => {
  it('Orders found should return 200', (done) => {
    chai
      .request(server)
      .get(adminUrl)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('array');
        expect(data[0]).to.haveOwnProperty('id');
        expect(data[0].id).to.be.a('number');
        expect(data[0]).to.haveOwnProperty('total');
        expect(data[0]).to.haveOwnProperty('status');
        expect(data[0].status).to.equal('pending');
        expect(data[0]).to.haveOwnProperty('paymentId');
        expect(data[0]).to.haveOwnProperty('userId');
        expect(data[0]).to.haveOwnProperty('Contents');
        expect(data[0].Contents).to.be.a('array');
        expect(data[0].Contents[0]).to.haveOwnProperty('itemId');
        expect(data[0].Contents[0]).to.haveOwnProperty('itemName');
        expect(data[0].Contents[0]).to.haveOwnProperty('cost');
        expect(data[0].Contents[0]).to.haveOwnProperty('quantity');
        expect(data[0]).to.haveOwnProperty('User');
        expect(data[0].User).to.be.a('object');
        expect(data[0].User).to.haveOwnProperty('firstName');
        expect(data[0].User).to.haveOwnProperty('lastName');
        expect(data[0].User).to.haveOwnProperty('address');
        expect(data[0].User).to.haveOwnProperty('phoneNumber');
        done();
      });
  });
});

describe('ADMIN UPDATE ORDER', () => {
  it('Invalid order status should return 400', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'something',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(orderUpdateInvalidStatus);
        done();
      });
  });
  it('Missing order status should return 400', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(orderUpdateEmptyStatus);
        done();
      });
  });
  it('Unexistant order should return 404', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/200`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'accepted',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(orderNotFound);
        done();
      });
  });
  it('Accepted order should return 200', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'accepted',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(orderUpdateSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data.id).to.equal(2);
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('accepted');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        done();
      });
  });
  it('Existing order status should return 409', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'accepted',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(orderUpdateConflict);
        done();
      });
  });
  it('On the move order should return 200', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'onthemove',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(orderUpdateSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data.id).to.equal(2);
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('onthemove');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        done();
      });
  });
  it('Completed order should return 200', (done) => {
    chai
      .request(server)
      .patch(`${adminUrl}/2`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'completed',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(orderUpdateSuccess);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('id');
        expect(data.id).to.be.a('number');
        expect(data.id).to.equal(2);
        expect(data).to.haveOwnProperty('total');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.equal('completed');
        expect(data).to.haveOwnProperty('paymentId');
        expect(data).to.haveOwnProperty('userId');
        done();
      });
  });
});
