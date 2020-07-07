const mongoose = require('mongoose');

const userPlant = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  PlantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'plants',
    required: [true, 'PlantId required']
  },
  plant_age: {
    type: Number,
    default: 0
  },
  water_reminder: {
    type: Number,
    default: 1
  },
  notes: {
    type: String
  },
  pupuk: {
    type: String
  },
  status: {
    type: String,
    default: 'hidup'
  },
  last_watering: {
    type: Date,
    default: new Date()
  },
  planted_date: {
    type: Date,
    default: new Date()
  },
  watered: {
    type: Boolean,
    default: false
  }
});

let UserPlant = mongoose.model('userplants', userPlant);

module.exports = UserPlant;