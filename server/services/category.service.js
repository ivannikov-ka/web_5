const db = require('../db');

class CategoryServices {
  async createCategory(name) {
    if (!name) {
      throw new Error('Validation Error');
    }
    const newCategory = await db.query(
      'INSERT INTO category (name) values ($1) RETURNING *',
      [name],
    );
    return newCategory.rows[0];
  }
  async getlAllCategories() {
    const allCategories = await db.query('SELECT * FROM category');
    return allCategories.rows;
  }
  async deleteCategory(id) {
    try {
      await db.query('DELETE FROM category WHERE id = $1', [id]);
      return 'Success deleted';
    } catch (err) {
      return err;
    }
  }
}

module.exports = new CategoryServices();
