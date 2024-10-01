const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.get('/', gameController.getGames);

router.get('/tags', gameController.getTags);

router.get('/:productId', gameController.getGame);

module.exports = router;
