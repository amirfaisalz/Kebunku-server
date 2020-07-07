const UserFav = require('../models/UserFavModel.js');

class UserFavController {
  static async findAll(req, res) {
    let UserId = req.UserId;
    const data = await UserFav.find({ UserId }).populate('PlantId');
    res.status(200).json({
      UserFav: data
    });
  }
  static create(req, res) {
    let { UserId } = req;
    let { PlantId } = req.body;

    let fav = new UserFav();
    fav.UserId = UserId;
    fav.PlantId = PlantId;
    fav.save((err) => {
      if(err) {
        res.status(500).json({
          message: err
        });
      } else {
        res.status(201).json({
          UserFav: fav
        });
      }
    });
  }
  static delete(req, res) {
    let { id } = req.params;
    UserFav.deleteOne({PlantId: id}, (err, data) => {
      if(err) {
        res.status(404).json({
          message: 'UserFav Not Found'
        });
      } else {
        res.status(200).json({
          message: 'Fav Deleted',
          data
        })
      }
    });
  }
}

module.exports = UserFavController;