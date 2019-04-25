const should = require('chai').should();
const server = require ('../server.js');
const { port, app, SHOPIFY_API_URL } = server;

describe('Server', () => {
  it('Should exist', done => {
    server.should.exist && app.should.exist;
    done();
  });
  it('Should use port 3000', done => {
    port.should.equal(3000);
    done();
  });
});

describe('Shopify API', () => {
  it('Should connect using "jakes-snake-store" ', done => {
    SHOPIFY_API_URL.should.include('jakes-snake-store');
    done();
  });
});