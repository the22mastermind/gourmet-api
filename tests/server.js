import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

chai.use(chaiHttp);
chai.should();

describe('Server initialization', () => {
  it('Unexistant route should return 404', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        if (err) done(err);
        const { error } = res.body;
        expect(res.status).to.equal(404);
        expect(error);
        expect(error).to.equal('Route not found');
        done();
      });
  });
});
