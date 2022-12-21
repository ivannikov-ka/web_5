const db = require('../db');
const sizeServices = require('../services/size.service');
const fsService = require('../services/fs.service');

class ClothesServices {
  async createClothes(name, isMale, cost, colorId, sizes, categoryId, images) {
    // console.log(name, isMale, cost, categoryId, colorId, sizes);
    const newClothes = await db.query(
      'INSERT INTO clothes (name, is_male, cost, category_id, color_id) values ($1, $2, $3, $4, $5) RETURNING *',
      [name, isMale, cost, categoryId, colorId],
    );

    for (let sizeId of sizes) {
      await db.query(
        'INSERT INTO clothes_size (clothes_id, size_id) values ($1, $2)',
        [newClothes.rows[0].id, sizeId],
      );
    }
    fsService.savePhotos(newClothes.rows[0].id, images);

    return newClothes.rows[0];
  }
  async getTotalPages(category, step) {
    let totalCount;
    if (category > 0) {
      console.log('Category', category);
      totalCount = await db.query(
        'SELECT count(*) FROM clothes where category_id = $1',
        [category],
      );
    } else {
      totalCount = await db.query('SELECT count(*) FROM clothes');
    }

    const totalPages = Math.ceil(totalCount.rows[0].count / step);
    return totalPages;
  }
  async getAllClothes(category, page = 1, step) {
    let clothes;
    if (category > 0) {
      console.log('Category', category);
      clothes = await db.query(
        'SELECT id, name, cost, color_id FROM clothes where category_id = $1 OFFSET $2 LIMIT $3',
        [category, step * (Number(page) - 1), step],
      );
    } else {
      clothes = await db.query(
        'SELECT id, name, cost, color_id FROM clothes OFFSET $1 LIMIT $2',
        [step * (Number(page) - 1), step],
      );
    }

    for (const clothesRow of clothes.rows) {
      const sizes = await db.query(
        'SELECT * FROM clothes_size as c_s INNER JOIN size as sz on sz.id = c_s.size_id  WHERE clothes_id = $1 ',
        [clothesRow.id],
      );
      clothesRow.sizes = [];
      for (let size of sizes.rows) {
        clothesRow.sizes.push({
          id: size.size_id,
          nameRus: size.name_rus,
          nameEur: size.name_eur,
        });
      }
      const color = await db.query(
        'SELECT id as color_id, hex FROM color where id = $1',
        [clothesRow.color_id],
      );
      clothesRow.color = color.rows[0];
      const photos = await fsService.getPhotoUrls(clothesRow.id);
      // console.log(photos);
      clothesRow.imagePath = photos[0];
    }
    return clothes.rows;
  }
  async getClothes(id) {
    const clothes = await db.query('SELECT * FROM clothes WHERE id = $1', [id]);
    const sizes = await db.query(
      'SELECT * FROM clothes_size as c_s INNER JOIN size as sz on sz.id = c_s.size_id  WHERE clothes_id = $1 ',
      [clothes?.rows[0]?.id],
    );
    clothes.rows[0].sizes = [];
    // clothes?.rows[0].sizes = [];
    for (let size of sizes.rows) {
      clothes?.rows[0].sizes.push({
        id: size.size_id,
        name_eur: size.name_eur,
        name_rus: size.name_rus,
      });
    }
    const color = await db.query(
      'SELECT id as color_id, hex FROM color where id = $1',
      [clothes.rows[0].color_id],
    );
    clothes.rows[0].color = color.rows[0];

    const images = await fsService.getPhotoUrls(clothes.rows[0].id);
    clothes.rows[0].images = images;

    return clothes.rows[0];
  }
  async deleteClothes(id) {
    await db.query('DELETE FROM clothes where id = $1', [id]);
    return 'Success deleted';
  }
  async editСlothes(id, clothes) {
    const sizes = await sizeServices.updateSizes(id, clothes.sizes);
    const updatedClothes = await db.query(
      'update clothes set name = $1, cost = $2, is_male = $3, category_id = $4, color_id = $5 where id = $6 returning *',
      [
        clothes.name,
        clothes.cost,
        clothes.isMale,
        clothes.categoryId,
        clothes.colorId,
        id,
      ],
    );
    fsService.savePhotos(id, clothes.images);
    updatedClothes.rows[0].sizes = sizes;
    return updatedClothes.rows[0];
  }
}

module.exports = new ClothesServices();
