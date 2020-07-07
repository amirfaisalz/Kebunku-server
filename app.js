const express = require('express');
const app = express();
const router = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config()

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
if(!db) {
  console.log('Error connecting to DB');
} else {
  console.log('Connected to DB');
}
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

module.exports = app;