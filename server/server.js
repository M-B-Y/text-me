const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token 
function verifyToken(token) {
    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (decode === undefined) {
            return done (Error(err.name))
        } else {
            return decode
        }
    })   
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    return db.users.findIndex(user => user.email === email && user.password === password) !== -1
}

server.post('/auth/login', (req, res) => {
    const { email, password } = req.body
    if (isAuthenticated({ email, password }) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({ status, message })
        return
    }
    const access_token = createToken({ email, password })
    res.status(200).json({ access_token })
})

// Check if the user email exists in database
function isUserExisted(attr, value) {
    return db.users.findIndex(user => user[attr] === value) !== -1
}

server.post('/register', (req, res) => {
    if ( typeof req.body.name == 'undefined' || typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' ) {
        const status = 401
        const message = 'One or more attributes are missing'
        res.status(status).json({ status, message })
        return
    }
    const { name, email, password } = req.body
    if ( isUserExisted('name', name) || isUserExisted('email', email) ) {
        const status = 409
        const message = (isUserExisted('name', name)) ? 'Name already exists' : 'Email already exists'
        res.status(status).json({ status, message })
        return
    }
    const users = router.db.get('users').value()
    const id = users.reduce((max, u) => Math.max(max, u.id), users[0].id) + 1;
    router.db.get('users').push({ id, name, email, password }).write()
    const status = 200
    const message = 'User successfully registered'
    res.status(status).json({ status, message })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Bad authorization header'
        res.status(status).json({ status, message })
        return
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1])
    } catch (err) {
        const status = 401
        const message = 'Error: invalid access_token'
        if( err == 'TokenExpiredError' ) { message = 'Error: expired access_token' }
        res.status(status).json({ status, message })
        return
    }

    //remove any id conflict error
    if( req.method == 'POST' ) {
        delete req.body.id
    }

    next()
})

server.use(router)

server.listen(3000, () => {
  console.log('Run Auth API Server')
})

// for testing purpose
module.exports = server