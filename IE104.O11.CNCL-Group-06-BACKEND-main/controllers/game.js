const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Game = require('../models/game');
const Tag = require('../models/tag');

exports.getGames = (req, res, next) => {
  Game.find()
    .sort({
      createdAt: -1,
    })
    .populate('tags')
    .then((games) => {
      res.status(200).json({
        message: 'Fetched game successfully',
        games: games,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getGame = (req, res, next) => {
  const productId = req.params.productId;
  Game.findById(productId)
    .populate('tags')
    .then((game) => {
      if (!game) {
        const error = new Error('Could not find product.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Product fetched', game: game });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTags = (req, res, next) => {
  Tag.find()
    .then((tags) => {
      res.status(200).json({
        message: 'Fetched tags successfully',
        tags: tags,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
