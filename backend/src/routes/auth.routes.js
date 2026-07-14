const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const ctrl = require('../controllers/auth.controller');

router.post('/auth/register', validate(registerSchema), ctrl.register);
router.post('/auth/login', validate(loginSchema), ctrl.login);
router.get('/user/profile', authenticate, ctrl.getProfile);

module.exports = router;