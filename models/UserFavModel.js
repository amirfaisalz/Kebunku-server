const mongoose = require('mongoose');

const userFav = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'UserId required']
  },
  PlantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'plants',
    required: [true, 'PlantId required']
  }
});

let UserPlant = mongoose.model('userfavs', userFav);

module.exports = UserPlant;