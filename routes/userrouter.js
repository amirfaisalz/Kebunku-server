const router = require('express').Router();
const loginController = require('../controllers/usercontroller');
const Authentication = require('../middlewares/Authentication.js');

router.post('/login', loginController.userLogin);
router.post('/register', loginController.userRegister);
router.post('/pushtoken', Authentication, loginController.userPushToken);
router.post('/googlelogin', loginController.googleLogin);

module.exports = router;