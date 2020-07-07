const Plant = require('../models/PlantModel.js');

class PlantController {
  static async findAll(req, res) {
    const data = await Plant.find({});
    res.status(200).json({
      Plants: data
    });
  }
}

module.exports = PlantController;