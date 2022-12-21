const categoryServices = require('../services/category.service');

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name } = req.body;
      const newCategory = await categoryServices.createCategory(name);
      res.json(newCategory, 201);
    } catch (error) {
      console.log(error);
      res.status(422).json('Validation Error!');
    }
  }
  async getlAllCategories(req, res) {
    try {
      const allCategory = await categoryServices.getlAllCategories();
      res.json(allCategory);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteCategory(req, res) {
    try {
      const { id } = req.body;
      res.json(await categoryServices.deleteCategory(id));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CategoryController();
