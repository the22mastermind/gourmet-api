import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  badRequest,
  success,
  notFound,
  unauthorized,
} = statusCodes;
const {
  emptyPhone,
  emptyPassword,
  invalidPhone,
  loginUserNotFound,
  loginSuccessful,
  loginUserWrongCredentials,
} = messages;
const baseUrl = '/api/auth/';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('LOGIN', () => {
  it('Empty request should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(`${emptyPhone}, ${emptyPassword}`);
        done();
      });
  });
  it('Invalid phone number should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: '250731110731',
        password: '@1hello',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(invalidPhone);
        done();
      });
  });
  it('Unknown property should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: '+250731110731',
        password: '@1hello',
        email: 'username@domain.com',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal('email is not allowed');
        done();
      });
  });
  it('Unexisting user should return 404', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: '+250731110731',
        password: '@1hello',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(loginUserNotFound);
        done();
      });
  });
  it('Wrong password should return 401', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        password: '@1hello',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(unauthorized);
        expect(error);
        expect(error).to.equal(loginUserWrongCredentials);
        done();
      });
  });
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
        expect(data).to.haveOwnProperty('role');
        expect(data.role).to.equal('customer');
        userToken = token;
        done();
      });
  });
});
