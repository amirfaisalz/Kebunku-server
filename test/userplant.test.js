const mongoose = require('mongoose');
const app = require('../app.js');
const request = require('supertest');
const dbHandler = require('./db-handler');
const UserPlant = require('../models/UserPlantModel.js');
const User = require('../models/usermodel.js');
const Plant = require('../models/PlantModel.js');
const { generateToken } = require('../helpers/jwt.js');

const newPlant = {
  name: "Tomat",
  scientific_name: "Solanum lycopersicum",
  overview: "Tomat (Solanum lycopersicum syn. Lycopersicum esculentum) adalah tumbuhan dari keluarga Solanaceae, tumbuhan asli Amerika Tengah dan Selatan, dari Meksiko sampai Peru. Tomat merupakan tumbuhan siklus hidup singkat, dapat tumbuh setinggi 1 sampai 3 meter. Tumbuhan ini memiliki buah berawarna hijau, kuning, dan merah yang biasa dipakai sebagai sayur dalam masakan atau dimakan secara langsung tanpa diproses. Tomat memiliki batang dan daun yang tidak dapat dikonsumsi karena masih sekeluarga dengan kentang dan Terung yang mengadung Alkaloid.",
  fase_vegetatif: "15-35",
  fase_generatif: "30-80",
  category: "Sayuran"
}
const userData = {
  name: 'Yosa',
  email: 'testing@mail.com',
  password: 'testing'
};
let PlantId;
let token;
let UserPlantId;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await dbHandler.connect();
  const insertPlant = new Plant(newPlant);
  const insertUser = new User(userData);
  PlantId = insertPlant._id;
  token = generateToken({
    id: insertUser._id,
    name: userData.name,
    email: userData.email
  });
  const insertFav = new UserPlant({
    UserId: insertUser._id,
    PlantId
  });
  UserPlantId = insertFav._id;
  insertUser.save((err) => {
    if(err) {
      console.log(err);
    } else {
      console.log(token);
    }
  });
  insertPlant.save((err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('insert success');
    }
  });
  insertFav.save((err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('insert userfav success');
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

describe('test userplant create', () => {
  describe('success', () => {
    it('get all userplant', async (done) => {
      request(app)
        .get('/userplant')
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('UserPlant');
            return done();
          }
        });
    });
    it('add new userplant', async (done) => {
      const newUserPlant = {
        PlantId,
        notes: 'contoh notes',
        water_reminder: 1
      }
      request(app)
        .post('/userplant')
        .send(newUserPlant)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('UserPlant');
            return done();
          }
        });
    });
    it('update userplant', async (done) => {
      const newUserPlant = {
        notes: 'contoh notes',
        water_reminder: 1
      }
      request(app)
        .put(`/userplant/${UserPlantId}`)
        .send(newUserPlant)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('UserPlant');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Data updated');
            return done();
          }
        });
    });
    it('delete userplant', async (done) => {
      request(app)
        .delete(`/userplant/${UserPlantId}`)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Plant Deleted');
            return done();
          }
        });
    });
    it('add new userplant', async (done) => {
      const newUserPlant = {
        PlantId,
        notes: 'contoh notes',
        water_reminder: 1,
        planted_date: '2020-06-27'
      }
      request(app)
        .post('/userplant')
        .send(newUserPlant)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            console.log(response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('UserPlant');
            return done();
          }
        });
    });
  });
  describe('failure', () => {
    it('failed create user plant', async (done) => {
      request(app)
        .post('/userplant')
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
            return done();
          }
        });
    });
    it('should return error update', async (done) => {
      request(app)
        .put(`/userplant/f235325f5f235c`)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('UserPlant Not Found');
            return done();
          }
        });
    });
    it('should return error not found', async (done) => {
      request(app)
        .delete(`/userplant/f235325f5f235c`)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('UserPlant Not Found');
            return done();
          }
        });
    });
  });
});