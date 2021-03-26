import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import statusCodes from '../src/utils/statusCodes';
import messages from '../src/utils/messages';
import db from '../src/database/models';

const {
  success,
  notFound,
} = statusCodes;
const {
  loginSuccessful,
  menuNotFound,
} = messages;
const baseUrl = '/api/menu';

chai.use(chaiHttp);
chai.should();

let userToken = null;

describe('CUSTOMER GET MENU', () => {
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
  it('Menu found should return 200', (done) => {
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
        expect(data[0].id).to.equal(1);
        expect(data[0]).to.haveOwnProperty('name');
        expect(data[0].name).to.be.a('string');
        expect(data[0]).to.haveOwnProperty('Items');
        expect(data[0].Items).to.be.a('array');
        expect(data[0].Items[0]).to.haveOwnProperty('id');
        expect(data[0].Items[0]).to.haveOwnProperty('name');
        expect(data[0].Items[0]).to.haveOwnProperty('description');
        expect(data[0].Items[0]).to.haveOwnProperty('cost');
        expect(data[0].Items[0]).to.haveOwnProperty('image');
        expect(data[0].Items[0]).to.haveOwnProperty('menuId');
        expect(data[0].Items[0].menuId).to.be.a('number');
        done();
      });
  });
  it('Clear items and menu records', async () => {
    await db.sequelize.query('DELETE FROM "Items";');
    await db.sequelize.query('DELETE FROM "Menus";');
  });
  it('Menu not found should return 404', (done) => {
    chai
      .request(server)
      .get(baseUrl)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(notFound);
        expect(error);
        expect(error).to.equal(menuNotFound);
        done();
      });
  });
});
