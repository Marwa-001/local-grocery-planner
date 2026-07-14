const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addItemSchema, updateItemSchema } = require('../schemas/listItem.schema');
const ctrl = require('../controllers/listItem.controller');

router.get('/listitems/:id/items', authenticate, ctrl.getItems);
router.post('/listitems/addItem/:id', authenticate, validate(addItemSchema), ctrl.addItem);
router.patch('/listitems/:id', authenticate, validate(updateItemSchema), ctrl.updateItem);
router.delete('/listitems/:id', authenticate, ctrl.deleteItem);

module.exports = router;