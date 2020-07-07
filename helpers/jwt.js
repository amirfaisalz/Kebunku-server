'use strict'

const jwt = require(`jsonwebtoken`)
require('dotenv').config()

function generateToken(obj) {
    return jwt.sign(obj, process.env.SECRETJWT)
}

function readToken(hash) {
    return jwt.verify(hash, process.env.SECRETJWT)
}

module.exports = {
    generateToken,
    readToken
}