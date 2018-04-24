const server = require('../server')

const chai = require('chai')
const chaiHttp = require('chai-http')
var should = chai.should()

chai.use(chaiHttp)

describe('Authentication with JWT', () => {
    describe('/POST auth/login', () => {
        it('it should not return a token', (done) => {
            const user = {
                email: 'joe@abc.com',
                password: 'jopwd'
            }
            chai.request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Incorrect email or password')
                    done();
                });
        })
    });

    describe('/POST auth/login', () => {
        it('it should return a token', (done) => {
            const user = {
                email: 'joe@abc.com',
                password: 'pwdjoe'
            }
            chai.request(server)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('access_token')
                    done();
                });
        })
    });
})