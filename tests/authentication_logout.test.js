import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  success,
  unauthorized,
} = statusCodes;
const {
  loginSuccessful,
  logoutSuccessful,
  invalidToken,
} = messages;
const baseUrl = '/api/auth/';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('LOGOUT', () => {
  it('Valid login should return 200', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        password: '@1helloworld',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(loginSuccessful);
        expect(token).to.be.a('string');
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('lastName');
        expect(data).to.haveOwnProperty('phoneNumber');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.be.a('boolean');
        expect(data.status).to.equal(true);
        expect(data.phoneNumber).to.equal(process.env.TWILIO_CUSTOMER_NUMBER);
        userToken = token;
        done();
      });
  });
  it('Valid logout should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}logout`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(logoutSuccessful);
        done();
      });
  });
  it('Request with invalid/expired token should return 401', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}logout`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(invalidToken);
        done();
      });
  });
});
