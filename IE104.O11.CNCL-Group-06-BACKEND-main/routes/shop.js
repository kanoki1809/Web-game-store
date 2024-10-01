const express = require('express');
const { body } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/post-cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart);
router.post('/post-cart-to-user', isAuth, shopController.postGamesToUser);
router.delete('/delete-in-cart', isAuth, shopController.deleteInCart);
router.delete('/delete-all-cart', isAuth, shopController.deleteAllCart);

module.exports = router;
