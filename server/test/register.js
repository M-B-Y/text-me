const server = require('../server')

const chai = require('chai')
const chaiHttp = require('chai-http')
var should = chai.should()

chai.use(chaiHttp)

describe('User Registration', () => {
    describe('/POST register', () => {
        it('it should return missing attribute(s) error', (done) => {
            const user = {
                email: 'jack@abc.com',
                password: 'jackpwd'
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('One or more attributes are missing')
                    done();
                });
        })
    });

    describe('/POST register', () => {
        it('it should return existing name error', (done) => {
            const user = {
                name: 'joe',
                email: 'jack@abc.com',
                password: 'jackpwd'
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Name already exists')
                    done();
                });
        })
    });

    describe('/POST register', () => {
        it('it should return existing email error', (done) => {
            const user = {
                name: 'jack',
                email: 'joe@abc.com',
                password: 'jackpwd'
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Email already exists')
                    done();
                });
        })
    });

    describe('/POST auth/login', () => {
        it('it should return success message', (done) => {
            const user = {
                name: 'jack',
                email: 'jack@abc.com',
                password: 'jackpwd'
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('User successfully registered')
                    done();
                });
        })
    });
})