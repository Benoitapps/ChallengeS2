let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const should = chai.should();
chai.use(chaiHttp);
require('./test.env.js');

describe('Test', () => {
    describe('/GET test, integration test', () => {
        it('it should GET test', (done) => {
            chai.request(server)
                .get('/test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Test');
                    done();
                });
        });
    });
});


