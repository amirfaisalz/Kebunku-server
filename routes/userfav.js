const router = require('express').Router();
const UserFavController = require('../controllers/UserFavController.js');
const Authentication = require('../middlewares/Authentication.js');

router.use(Authentication);
router.get('/', UserFavController.findAll);
router.post('/', UserFavController.create);
router.delete('/:id', UserFavController.delete);

module.exports = router;