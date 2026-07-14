const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const ctrl = require('../controllers/favourite.controller');

router.get('/favourites', authenticate, ctrl.getFavourites);
router.post('/favourites/:id', authenticate, ctrl.addFavourite);
router.delete('/favourites/:id', authenticate, ctrl.removeFavourite);

module.exports = router;