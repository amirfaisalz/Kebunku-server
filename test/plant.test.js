const mongoose = require('mongoose');
const app = require('../app.js');
const request = require('supertest');
const dbHandler = require('./db-handler');
const Plant = require('../models/PlantModel.js');

const newPlant = {
  name: "Tomat",
  scientific_name: "Solanum lycopersicum",
  overview: "Tomat (Solanum lycopersicum syn. Lycopersicum esculentum) adalah tumbuhan dari keluarga Solanaceae, tumbuhan asli Amerika Tengah dan Selatan, dari Meksiko sampai Peru. Tomat merupakan tumbuhan siklus hidup singkat, dapat tumbuh setinggi 1 sampai 3 meter. Tumbuhan ini memiliki buah berawarna hijau, kuning, dan merah yang biasa dipakai sebagai sayur dalam masakan atau dimakan secara langsung tanpa diproses. Tomat memiliki batang dan daun yang tidak dapat dikonsumsi karena masih sekeluarga dengan kentang dan Terung yang mengadung Alkaloid.",
  fase_vegetatif: "15-35",
  fase_generatif: "30-80",
  category: "Sayuran"
}

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect();
  const insertPlant = new Plant(newPlant);
  insertPlant.save((err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('insert success');
    }
  });
});

/**
 * Clear all test data after every test.
 */
afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
  }
);

describe('show all plants', () => {
  it('success', async (done) => {
    request(app)
      .get('/plants')
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          let data = response.body;
          expect(data).toHaveProperty('Plants');
          return done();
        }
      });
  });
});