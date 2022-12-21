const db = require('../db');
const fs = require('fs');
const { readdir } = require('node:fs/promises');

class FSService {
  async getPhotoUrls(productId) {
    const imagesUrls = [];
    const files = await readdir('public/images/' + productId);
    for (const file of files) imagesUrls.push(`picture/${productId}/${file}`);
    // console.log(imagesUrls);
    return imagesUrls;
  }
  async savePhotos(productId, photos) {
    if (!fs.existsSync('public/images/' + productId)) {
      fs.mkdirSync('public/images/' + productId);
    } else {
      fs.readdirSync('public/images/' + productId).forEach((f) =>
        fs.rmSync(`${'public/images/' + productId}/${f}`),
      );
    }
    photos.map(async (photo, index) => {
      fs.writeFileSync(
        `public/images/${productId}/${index}.jpeg`,
        photo.replace(/^data:image\/jpeg;base64,/, ''),
        'base64',
        function (err) {
          console.log(err);
        },
      );
    });
  }
  async deletePhotos(productId) {
    fs.rmSync('public/images' + productId, { recursive: true });
  }
}

module.exports = new FSService();
