const Router = require('express');
const router = new Router();
const sizeController = require('../controller/size.controller');

router.post('/size', sizeController.createSize);
router.get('/size', sizeController.getAllSizes);
router.delete('/size', sizeController.deleteSize);

module.exports = router;
