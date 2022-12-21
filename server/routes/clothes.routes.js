const Router = require('express');
const router = new Router();
const clothesController = require('../controller/clothes.controller');

router.post('/clothes', clothesController.createClothes);
router.put('/clothes/:id', clothesController.editСlothes);
router.get('/clothes', clothesController.getlAllClothes);
router.get('/clothes/:id', clothesController.getClothes);
router.delete('/clothes/:id', clothesController.deleteClothes);

module.exports = router;
