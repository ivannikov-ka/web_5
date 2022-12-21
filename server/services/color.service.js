const db = require('../db');

class ColorServices {
  async createColor(name, hex) {
    const newColor = await db.query(
      'INSERT INTO color (name, hex) values ($1, $2) RETURNING *',
      [name, hex],
    );
    return newColor.rows[0];
  }
  async getAllColors() {
    const colors = await db.query('SELECT * FROM color');
    return colors.rows;
  }
  async deleteColor(id) {
    await db.query('DELETE FROM color where id = $1', [id]);
    return 'Success deleted';
  }
}

module.exports = new ColorServices();
