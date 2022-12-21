const sizeServices = require('../services/size.service');

class SizeController {
  async createSize(req, res) {
    try {
      const { name_eur, name_rus } = req.body;
      const newSize = await sizeServices.createSize(name_eur, name_rus);
      res.json(newSize, 201);
    } catch (error) {
      console.log(error);
      res.status(422).json('Validation Error!');
    }
  }
  async getAllSizes(req, res) {
    try {
      const sizes = await sizeServices.getAllSizes();
      res.json(sizes);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteSize(req, res) {
    try {
      const { id } = req.body;
      res.json(await sizeServices.deleteSize(id));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new SizeController();
