const router = require('express').Router();
const PlantController = require('../controllers/PlantController.js');

router.get('/', PlantController.findAll);

module.exports = router;