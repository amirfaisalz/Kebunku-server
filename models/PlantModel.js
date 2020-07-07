const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  scientific_name: {
    type: String
  },
  overview: {
    type: String
  },
  fase_vegetatif: {
    type: String
  },
  fase_generatif: {
    type: String
  },
  category: {
    type: String
  },
  howto: {
    type: [mongoose.Schema.Types.Mixed]
  },
  video: {
    type: String
  }
});

let Plant = mongoose.model('plants', plantSchema);

module.exports = Plant;