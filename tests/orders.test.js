import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  badRequest,
  success,
  created,
} = statusCodes;
const {
  loginSuccessful,
  orderEmpty,
  orderSuccess,
  emptyTotal,
  emptyItemCost,
  invalidRequest,
} = messages;
const baseUrl = '/api/orders';

chai.use(chaiHttp);
chai.should();

let userToken = null;

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
        const { message, token} = res.body;
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
        paymentId: '123456789'
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
        paymentId: '123456789'
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
        paymentId: '123456789'
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
        paymentId: '123456789'
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
        paymentId: '123456789'
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
