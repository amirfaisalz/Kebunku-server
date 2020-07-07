const router = require('express').Router();
const UserPlantController = require('../controllers/UserPlantController.js');
const Authentication = require('../middlewares/Authentication.js');

router.use(Authentication);
router.get('/', UserPlantController.findAll);
router.post('/', UserPlantController.create);
router.put('/:id', UserPlantController.update);
router.delete('/:id', UserPlantController.delete);

module.exports = router;