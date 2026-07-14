const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../schemas/product.schema');
const ctrl = require('../controllers/product.controller');

router.get('/products', ctrl.getProducts); // public
router.post('/product/create', authenticate, isAdmin, validate(createProductSchema), ctrl.createProduct);
router.patch('/product/:id', authenticate, isAdmin, validate(updateProductSchema), ctrl.updateProduct);
router.delete('/product/:id', authenticate, isAdmin, ctrl.deleteProduct);

module.exports = router;