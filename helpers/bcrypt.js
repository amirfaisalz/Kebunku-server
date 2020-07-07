'use strict'
const bcryptjs = require(`bcryptjs`)

const salt = bcryptjs.genSaltSync(8)

function plaintoHash (str) {
    return bcryptjs.hashSync(str, salt)
}

function verifyHash (str, hash) {
    return bcryptjs.compareSync(str, hash)
}

module.exports = {
    plaintoHash,
    verifyHash
}