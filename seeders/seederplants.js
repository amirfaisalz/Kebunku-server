const Plant = require('../models/PlantModel.js');
const mongoose = require('mongoose');
const data = require('../data/plants.json');

mongoose.connect('mongodb://localhost:27017/kebunku-server', { useNewUrlParser: true, useUnifiedTopology: true});

data.map(async (plant, index) => {
  const p = new Plant(plant);
  await p.save((err, result) => {
    if (index === data.length - 1) {
      console.log("Seed data plant Done!");
      mongoose.disconnect();
    }
  });
});