import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const {
  badRequest,
  conflict,
  created,
  success,
  forbidden,
} = statusCodes;
const {
  emptyFirstName,
  emptyLastName,
  emptyPhone,
  emptyAddress,
  emptyPassword,
  invalidPhone,
  signupConflict,
  signupSuccessful,
  emptyOTP,
  invalidOTP,
  wrongOTP,
  verifySuccessful,
  invalidRequest,
  resendOTPSuccessful,
} = messages;
const baseUrl = '/api/auth/';

chai.use(chaiHttp);
chai.should();

let userToken = null;
let userOTP = null;

describe('SIGN UP', () => {
  it('Empty request should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}signup`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(`${emptyFirstName}, ${emptyLastName}, ${emptyPhone}, ${emptyAddress}, ${emptyPassword}`);
        done();
      });
  });
  it('Invalid phone number should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}signup`)
      .send({
        firstName: 'Ethan',
        lastName: 'Hunt',
        phoneNumber: '250731110731',
        address: 'KN 2 St, 80, 7th Floor, 4',
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
      .post(`${baseUrl}signup`)
      .send({
        firstName: 'Ethan',
        lastName: 'Hunt',
        phoneNumber: '+250731110731',
        address: 'KN 2 St, 80, 7th Floor, 4',
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
  it('Valid signup should return 201', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}signup`)
      .send({
        firstName: 'Jules',
        lastName: 'Winnfield',
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        address: 'KN 2 St, 80, 7th Floor, 4',
        password: '@1helloworld',
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, token, data } = res.body;
        expect(res.status).to.equal(created);
        expect(message);
        expect(message).to.equal(signupSuccessful);
        expect(token).to.be.a('string');
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('phoneNumber');
        expect(data).to.haveOwnProperty('status');
        expect(data).to.haveOwnProperty('otp');
        expect(data.status).to.be.a('boolean');
        expect(data.status).to.equal(false);
        expect(data).to.haveOwnProperty('role');
        expect(data.role).to.equal('customer');
        userToken = token;
        userOTP = data.otp;
        done();
      });
  });
  it('Signup with existing phone number should return 409', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}signup`)
      .send({
        firstName: 'Jules',
        lastName: 'Winnfield',
        phoneNumber: process.env.TWILIO_CUSTOMER_NUMBER,
        address: 'KN 2 St, 80, 7th Floor, 4',
        password: '@1hello',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(conflict);
        expect(error);
        expect(error).to.equal(signupConflict);
        done();
      });
  });
});

describe('VERIFY SIGNUP', () => {
  it('Empty request should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(emptyOTP);
        done();
      });
  });
  it('Invalid OTP should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        otp: 'Ethan',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal(invalidOTP);
        done();
      });
  });
  it('Unknown property should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        otp: '123456',
        firstName: 'Ethan',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(badRequest);
        expect(error);
        expect(error).to.equal('firstName is not allowed');
        done();
      });
  });
  it('Wrong OTP should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        otp: '123456',
      })
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(forbidden);
        expect(error);
        expect(error).to.equal(wrongOTP);
        done();
      });
  });
  it('Valid OTP but absent token should return 400', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .send({
        otp: userOTP,
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
  it('Valid OTP should return 200', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}verify`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        otp: userOTP,
      })
      .end((err, res) => {
        if (err) done(err);
        const { message, data } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(verifySuccessful);
        expect(data);
        expect(data).to.be.a('object');
        expect(data).to.haveOwnProperty('firstName');
        expect(data).to.haveOwnProperty('lastName');
        expect(data).to.haveOwnProperty('status');
        expect(data.status).to.be.a('boolean');
        expect(data.status).to.equal(true);
        done();
      });
  });
  it('Resend OTP should return 200', (done) => {
    chai
      .request(server)
      .get(`${baseUrl}verify/retry`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { message } = res.body;
        expect(res.status).to.equal(success);
        expect(message);
        expect(message).to.equal(resendOTPSuccessful);
        done();
      });
  });
});
