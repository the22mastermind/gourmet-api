import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  badRequest,
  success,
} = statusCodes;
const {
  loginSuccessful,
  emptyAmount,
} = messages;
const baseUrl = '/api/payments';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('GENERATE PAYMENT INTENT', () => {
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
  it('Missing payment amount should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(emptyAmount);
        done();
      });
  });
  it('Invalid payment amount should return 400', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 'hellothere',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal('amount must be a number');
        done();
      });
  });
  it('Valid place order should return 201', (done) => {
    chai
      .request(server)
      .post(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 800,
      })
      .end((err, res) => {
        if (err) done(err);
        const { data } = res.body;
        expect(res.status).to.equal(success);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('publishableKey');
        expect(data).to.haveOwnProperty('clientSecret');
        done();
      });
  });
});
