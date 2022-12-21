const Router = require('express');
const router = new Router();
const colorController = require('../controller/color.controller');

router.post('/color', colorController.createColor);
router.get('/color', colorController.getAllColors);
router.delete('/color', colorController.deleteColor);

module.exports = router;
