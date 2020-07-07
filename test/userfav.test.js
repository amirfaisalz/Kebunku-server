const mongoose = require('mongoose');
const app = require('../app.js');
const request = require('supertest');
const dbHandler = require('./db-handler');
const UserFav = require('../models/UserFavModel.js');
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
let FavId;

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
  const insertFav = new UserFav({
    UserId: insertUser._id,
    PlantId
  });
  FavId = insertFav._id;
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

describe('get all userfav', () => {
  describe('success', () => {
    it('should return all userfav', async (done) => {
      request(app)
        .get('/userfav')
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('UserFav');
            return done();
          }
        });
    });
    it('should create user fav', async (done) => {
      request(app)
        .post('/userfav')
        .send({
          PlantId
        })
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('UserFav');
            return done();
          }
        });
    });
    it('should remove user fav', async (done) => {
      request(app)
        .delete(`/userfav/${FavId}`)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Fav Deleted')
            return done();
          }
        });
    });
  });
  describe('failure', () => {
    it('should return error with message', async (done) => {
      const errMessage = {
        error: 'Please Login First!'
      }
      request(app)
        .get('/userfav')
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errMessage);
            return done();
          }
        });
    });
    it('failed create user fav', async (done) => {
      request(app)
        .post('/userfav')
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
    it('should remove user fav', async (done) => {
      request(app)
        .delete(`/userfav/f235325f5f235c`)
        .set('token', token)
        .end((err, response) => {
          if(err) {
            return done(err);
          } else {
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('UserFav Not Found');
            return done();
          }
        });
    });
  })
});
