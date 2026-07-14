const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validate = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../schemas/category.schema');
const ctrl = require('../controllers/category.controller');

router.get('/categories', ctrl.getCategories);
router.post('/categories/create', authenticate, isAdmin, validate(createCategorySchema), ctrl.createCategory);
router.patch('/categories/:id', authenticate, isAdmin, validate(updateCategorySchema), ctrl.updateCategory);

module.exports = router;