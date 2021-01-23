import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';

const { success } = statusCodes;
const { loginSuccessful } = messages;
const baseUrl = '/api/auth/';

chai.use(chaiHttp);
chai.should();

describe('ADMIN LOGIN', () => {
  it('Valid admin login should return 200', (done) => {
    chai
      .request(server)
      .post(`${baseUrl}login`)
      .send({
        phoneNumber: process.env.ADMIN_PHONE,
        password: process.env.ADMIN_PASSWORD,
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
        expect(data.phoneNumber).to.equal(process.env.ADMIN_PHONE);
        expect(data).to.haveOwnProperty('role');
        expect(data.role).to.equal('admin');
        done();
      });
  });
});
