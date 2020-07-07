const UserPlant = require('../models/UserPlantModel.js');

class UserPlantController {
  static async findAll(req, res) {
    let UserId = req.UserId;
    const data = await UserPlant.find({ UserId }).populate('PlantId');
    res.status(200).json({
      UserPlant: data
    });
  }
  static create(req, res) {
    let { UserId } = req;
    let { PlantId, notes, water_reminder, plant_age, status, last_watering, planted_date, pupuk, watered } = req.body;
    if(!planted_date) {
      planted_date = new Date();
    } else {
      planted_date = new Date(planted_date);
    }
    if(!last_watering) {
      last_watering = new Date();
    }
    let plant = new UserPlant();
    plant.UserId = UserId;
    plant.PlantId = PlantId;
    plant.notes = notes;
    plant.water_reminder = water_reminder;
    plant.plant_age = plant_age;
    plant.status = status;
    plant.last_watering = last_watering;
    plant.planted_date = planted_date;
    plant.pupuk = pupuk;
    plant.watered = watered;

    plant.save((err) => {
      if(err) {
        res.status(500).json({
          message: err
        });
      } else {
        res.status(201).json({
          UserPlant: plant
        });
      }
    });
  }
  static update(req, res) {
    let { id } = req.params;
    let { notes, water_reminder, plant_age, status, last_watering, watered } = req.body;
    UserPlant.findById(id, (err, data) => {
      if(err) {
        res.status(404).json({
          message: 'UserPlant Not Found'
        });
      } else {
        data.plant_age = plant_age ? plant_age : data.plant_age;
        data.notes = notes;
        data.status = status ? status : data.status;
        data.water_reminder = water_reminder ? water_reminder : data.water_reminder;
        data.last_watering = last_watering ? last_watering : data.last_watering;
        data.watered = watered ? watered : data.watered;
        
        data.save((err) => {
          if(err) {
            res.status(500).json({
              message: err
            });
          } else {
            res.status(200).json({
              message: 'Data updated',
              UserPlant: data
            });
          }
        });
      }
    });
  }
  static delete(req, res) {
    let { id } = req.params;
    UserPlant.deleteOne({_id: id}, (err, data) => {
      if(err) {
        res.status(404).json({
          message: 'UserPlant Not Found'
        });
      } else {
        res.status(200).json({
          message: 'Plant Deleted',
          data
        })
      }
    });
  }
}

module.exports = UserPlantController;