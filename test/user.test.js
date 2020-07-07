const mongoose = require('mongoose');
const app = require('../app.js');
const request = require('supertest');
const dbHandler = require('./db-handler');
const User = require('../models/usermodel.js');
const { generateToken } = require('../helpers/jwt.js');

/**
 * user.
 */
const userData = {
    name: 'Yosa',
    email: 'testing@mail.com',
    password: 'testing'
};

const google_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MWEzNTcwYjhlM2FlMWI3MmNhYWJjYWE3YjhkMmRiMjA2NWQ3YzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQwNDQ5NTU5ODQ1MTY4NjIxNzkiLCJlbWFpbCI6Inlvc2EuYWxmcTRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJWdmhaTFo1VC02N0U3b0U4OFJMUDV3IiwibmFtZSI6Illvc2EgQWxmaXFpZSIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLTF0V00wb1EwRFNNL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y210a1Fub2JYNDhublBiRUhfR1ZVenc3UzctNFEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6Illvc2EiLCJmYW1pbHlfbmFtZSI6IkFsZmlxaWUiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU5MzQ1MDM2MCwiZXhwIjoxNTkzNDUzOTYwfQ.O4B2p8sTXy0U8kW_xwll2KHemYu1kPC5UrY2cDTO7aMIka_yGWpoPyDTnScSXE2_FeZFl9IHZgm0rJeBgAS77mjoL_IMwEEqM62M9FP0qCEjZ51L_DOI1TgApm72qBWrS1Wzgo55-kuT9mVNIjEy-N0mPBxp_h4Qb7B5oFWWJjNaIuDfsjc9oHlRVQMClG2BWyFlbYW1QWqN_-9WWhfdrW1MF7lmotUWtn3C9MHHvWHWFFX-3bDdUm4HX6_3Y3Bur0wb6WTmuUe-TLbAOWPl-obP_owCEcfE7kpBQ91ZRXKcZKCglaPbL7TyMxW8WRLwsOK8on2OTcZURiNczEN_Eg'

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
});

/**
 * Remove and close the db and server.
 */
// afterAll(async () => await dbHandler.closeDatabase());

/**
 * Product test suite.
 */
describe('user ', () => {

    /**
     * Tests that a valid product can be created through the productService without throwing any errors.
     */
    describe('success', () => {
        it('test server', async (done) => {
          const message = {
            message: 'Kebunku server running'
          };
          request(app)
            .get('/')
            .end((err, response) => {
              if(err) {
                return done(err);
              } else {
                expect(response.status).toBe(200);
                expect(response.body).toStrictEqual(message);
                return done();
              }
            })
        });
        it('user register', async (done) => {
            request(app)
              .post(`/register`)
              .send(userData)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  expect(data._id).toBeDefined();
                  expect(data.name).toBe(userData.name);
                  expect(data.email).toBe(userData.email);
                  expect(data.password).toBeUndefined();
                  return done();
                }
              });
        });
        it('user login', async (done) => {
            request(app)
              .post(`/login`)
              .send(userData)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  expect(data.token).toBeDefined();
                  return done();
                }
              });
        });
        it('user login', async (done) => {
          request(app)
            .post(`/googlelogin`)
            .set('google_token', google_token)
            .end((err, response) => {
              if (err) {
                return done(err);
              } else {
                let data = response.body;
                expect(data.token).toBeUndefined();
                return done();
              }
            });
        });
        it('add user push token', async (done) => {
          const insertUser = new User(userData);
          let token = generateToken({
            id: insertUser._id,
            name: userData.name,
            email: userData.email
          });
          insertUser.save((err) => {
            if(err) {
              console.log(err);
            } else {
              console.log(token);
            }
          });
          request(app)
            .post(`/pushtoken`)
            .set('token', token)
            .send({
              pushToken: 'ExponentPushToken[I2pRAEHx5fwJdJCsBeM1ZA]'
            })
            .end((err, response) => {
              if (err) {
                return done(err);
              } else {
                console.log(response.body);
                let data = response.body;
                expect(data).toHaveProperty('User');
                expect(data.User).toHaveProperty('pushToken');
                expect(data.User.pushToken).toBe('ExponentPushToken[I2pRAEHx5fwJdJCsBeM1ZA]');
                return done();
              }
            });
        });
    });
    describe('failure', () => {
        it('should return error name is required', (done) => {
            const userRegister = {
                email: 'yosa@mail.com',
                password: 'testing'
            }
            const errorMessage = {
                error: 'users validation failed: name: Name required'
            }
            request(app)
              .post(`/register`)
              .send(userRegister)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
        it('should return error name is required', (done) => {
          const userRegister = {
              name: 'asd',
              email: 'yosa@mail.com',
              password: 'testing'
          }
          const errorMessage = {
              error: 'users validation failed: name: Name need to be at least 4 character'
          }
          request(app)
            .post(`/register`)
            .send(userRegister)
            .end((err, response) => {
              if (err) {
                return done(err);
              } else {
                let data = response.body;
                expect(data).toStrictEqual(errorMessage);
                return done();
              }
            });
      });
        it('should return error password length', (done) => {
            const userRegister = {
                email: 'yosa@mail.com',
                password: '123'
            }
            const errorMessage = {
                error: 'users validation failed: password: Password need to be between 4 to 10 character'
            }
            request(app)
              .post(`/register`)
              .send(userRegister)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
        it('should return error invalid email', (done) => {
            const userRegister = {
                name: 'Yosa',
                email: 'bukan email nih',
                password: 'testing'
            }
            const errorMessage = {
                error: `users validation failed: email: '${userRegister.email}' is not a valid email format`
            }
            request(app)
              .post(`/register`)
              .send(userRegister)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
        it('should return error email already registerd', (done) => {
          const userRegister = {
              name: 'Yosa',
              email: 'testing@mail.com',
              password: 'testing'
          }
          const errorMessage = {
            error: `users validation failed: email: '${userRegister.email}' is not a valid email format`,
            error: `users validation failed: email: ${userRegister.email} is already registered`
          }
          request(app)
            .post(`/register`)
            .send(userRegister)
            .end((err, response) => {
              if (err) {
                return done(err);
              } else {
                let data = response.body;
                expect(data).toStrictEqual(errorMessage);
                return done();
              }
            });
      });
        it('should return error invalid email', (done) => {
            const errorMessage = {
                error: 'users validation failed: name: Name required, email: Email required'
              }
            request(app)
              .post(`/register`)
              .send()
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  console.log(data);
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
        it('user login', async (done) => {
            const failLogin = {
                name: 'Yosa',
                email: 'gaadaemail@mail.com',
                password: 'testing'
            };
            const errorMessage = {
                error: 'Email Not Found'
            }
            request(app)
              .post(`/login`)
              .send(failLogin)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  console.log(data);
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
        it('user login', async (done) => {
            const failLogin = {
                name: 'Yosa',
                email: 'testing@mail.com',
                password: 'salahpass'
            };
            const errorMessage = {
                error: 'Invalid email and password combination'
            }
            request(app)
              .post(`/login`)
              .send(failLogin)
              .end((err, response) => {
                if (err) {
                  return done(err);
                } else {
                  let data = response.body;
                  console.log(data);
                  expect(data).toStrictEqual(errorMessage);
                  return done();
                }
              });
        });
    });
});
