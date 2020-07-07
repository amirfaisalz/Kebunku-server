const router = require('express').Router();
const userRouter = require('./userrouter');
const plantRouter = require('./plant.js');
const userPlantRouter = require('./userplant.js');
const userFavRouter = require('./userfav.js');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Kebunku server running'
  })
});

router.use('/', userRouter);
router.use('/plants', plantRouter);
router.use('/userplant', userPlantRouter);
router.use('/userfav', userFavRouter);

module.exports = router;