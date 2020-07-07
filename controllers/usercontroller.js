const { generateToken } = require('../helpers/jwt')
const { plaintoHash, verifyHash } = require('../helpers/bcrypt')
const User = require('../models/usermodel');
const { restart } = require('nodemon');
const verificationGoogle = require('../helpers/googleOAuth');

class UserController {
    static async userLogin( req, res) {
        const { email, password } = req.body;
        await User.findOne({ email }, (error, result) => {
            if(error) {
                res.status(500).json({
                    error
                })
            } else {
                if(result) {
                    if( verifyHash(password, result.password)) {
                        let token = generateToken({
                            id: result._id,
                            name: result.name,
                            email: result.email
                        });
                        res.status(200).json({
                            name: result.name,
                            email: result.email,
                            token
                        });
                    } else {
                        res.status(401).json({
                            error: 'Invalid email and password combination'
                        })
                    }
                } else {
                    res.status(200).json({
                        error: 'Email Not Found'
                    });
                }
            }
        })
    }
    static async userRegister ( req, res) {
        let { name, email , password } = req.body
        User.countDocuments({ email }, (err, count) => {
            if(err) {
                res.status(500).json({ error })
            } else if(count > 0) {
                res.status(400).json({
                    error: `users validation failed: email: ${email} is already registered`
                })
            } else {
                if (password) {
                    if(password.length < 4 || password.length > 10) {
                        return res.status(400).json({
                            error: 'users validation failed: password: Password need to be between 4 to 10 character'
                        });
                    } else {
                        password = plaintoHash(password)
                    }
                }
                const newUser = new User({ name, email , password})
                newUser.save((error, result) => {
                    if(error) {
                        res.status(400).json({
                            error: error.message
                        })
                    } else {
                        result.password = undefined;
                        res.status(201).json(result)
                    }
                })
            }
        })
    }
    static googleLogin (req, res) {
        let googleToken = req.headers.google_token;
        let email;
        let name;

        /* istanbul ignore next */
        verificationGoogle(googleToken)
            .then(payload => {
                console.log(payload);
                email = payload.email;
                name = payload.name;
                User.findOne({ email }, (err, result) => {
                    if(err) {
                        res.status(500).json({
                            err
                        });
                    } else {
                        if(result) {
                            let token = generateToken({
                                id: result._id,
                                name: result.name,
                                email: result.email
                            });
                            res.status(200).json({
                                token
                            });
                        } else {
                            let newUser = new User({
                                name,
                                email,
                                password: process.env.DEFAULT_GOOGLE_PASSWORD
                            });
                            newUser.save((err, data) => {
                                if(err) {
                                    res.status(500).json({
                                        error: err.message
                                    });
                                } else {
                                    res.status(201).json({
                                        data
                                    });
                                }
                            });
                        }
                    }
                })
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    error
                });
            });
            /* istanbul ignore next */
    }
    static userPushToken (req, res) {
        let { pushToken } = req.body
        let UserId = req.UserId;
        User.findById(UserId, (err, data) => {
            if(err) {
                res.status(404).json({
                    message: 'User Not Found'
                });
            } else {
                data.pushToken = pushToken;
                data.save((err) => {
                    if(err) {
                        res.status(500).json({
                            message: err
                        });
                    } else {
                        res.status(200).json({
                            message: 'Data updated',
                            User: data
                        });
                    }
                });
            }
        });
    }
}

module.exports = UserController;