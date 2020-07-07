const User = require('../models/usermodel.js');
const { readToken } = require('../helpers/jwt.js');
const mongoose = require('mongoose');

const authentication = async (req, res, next) => {
  let token = req.headers.token;
  try {
    let decode = readToken(token);
    let { id } = decode;
    id = mongoose.Types.ObjectId(id);
    const data  = await User.find(id);
    req.UserId = data[0]._id;
    return next();
  } catch(error) {
    res.status(400).json({
      error: 'Please Login First!'
    })
  }
}

module.exports = authentication;