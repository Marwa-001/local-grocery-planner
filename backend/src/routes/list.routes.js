const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createListSchema, updateListSchema } = require('../schemas/list.schema');
const ctrl = require('../controllers/list.controller');

router.get('/lists', authenticate, ctrl.getLists);
router.post('/lists', authenticate, validate(createListSchema), ctrl.createList);
router.patch('/list/:id', authenticate, validate(updateListSchema), ctrl.updateList);
router.delete('/list/:id', authenticate, ctrl.deleteList);

module.exports = router;