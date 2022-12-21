const colorServices = require('../services/color.service');

class ColorController {
  async createColor(req, res) {
    try {
      const { name, hex } = req.body;
      const newColor = await colorServices.createColor(name, hex);
      res.json(newColor, 201);
    } catch (error) {
      console.log(error);
      res.status(422).json('Validation Error!');
    }
  }
  async getAllColors(req, res) {
    try {
      const countries = await colorServices.getAllColors();
      res.json(countries);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteColor(req, res) {
    try {
      const { id } = req.body;
      res.json(await colorServices.deleteColor(id));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ColorController();
