const db = require('../db');

class SizeServices {
  async createSize(name_eur, name_rus) {
    const newContry = await db.query(
      'INSERT INTO size (name_eur, name_rus) values ($1, $2) RETURNING *',
      [name_eur, name_rus],
    );
    return newContry.rows[0];
  }
  async getAllSizes() {
    const Sizes = await db.query('SELECT * FROM size');
    return Sizes.rows;
  }
  async deleteSize(id) {
    await db.query('DELETE FROM size where id = $1', [id]);
    return 'Success deleted';
  }
  async updateSizes(id, sizes) {
    await db.query('delete from clothes_size where clothes_id = $1', [id]);
    for (const size of sizes) {
      await db.query(
        'INSERT INTO clothes_size (clothes_id, size_id) values ($1, $2)',
        [id, size],
      );
    }
  }
}

module.exports = new SizeServices();
