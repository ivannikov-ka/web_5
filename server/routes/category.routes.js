const Router = require('express');
const router = new Router();
const categoryController = require('../controller/category.controller');

router.post('/category', categoryController.createCategory);
router.get('/category', categoryController.getlAllCategories);
router.delete('/category', categoryController.deleteCategory);

module.exports = router;
