// const Order = require('../models/order');
const User = require('../models/user');
const Game = require('../models/game');
const mongoose = require('mongoose');
const user = require('../models/user');

exports.postCart = (req, res, next) => {
  const gameId = new mongoose.Types.ObjectId(req.body.gameId);
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (!user.cart) {
        user.cart = { items: [] };
      }
      if (user.games.find((game) => game.toString() === gameId.toString())) {
        const error = new Error('User has game already');
        error.statusCode = 404;
        throw error;
      }
      if (
        user.cart.items.find((game) => game.toString() === gameId.toString())
      ) {
        const error = new Error('Game already in cart');
        error.statusCode = 404;
        throw error;
      }
      user.cart.items.push(gameId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Cart posted' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      const gameIds = user.cart.items;
      const gamePromises = gameIds.map((gameId) =>
        Game.findById(gameId).populate('tags')
      );

      return Promise.all(gamePromises);
    })
    .then((games) => {
      res.status(200).json({ message: 'Cart fetched', cart: games });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteInCart = (req, res, next) => {
  const gameId = req.body.gameId;
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (user.cart.items.length === 0) {
        const error = new Error('No cart found');
        error.statusCode = 404;
        throw error;
      }
      const gameIndex = user.cart.items.indexOf(gameId);
      if (gameIndex === -1) {
        const error = new Error('this game not found');
        error.statusCode = 404;
        throw error;
      }
      user.cart.items.splice(gameIndex, 1);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Game removed from cart' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postGamesToUser = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user.cart.items.length === 0) {
        const error = new Error('No cart found');
        error.statusCode = 404;
        throw error;
      }
      user.games = [...user.games, ...user.cart.items];
      return user.clearCart();
    })
    .then((user) => {
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Cart posted' });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteAllCart = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      return user.clearCart();
    })
    .then((user) => {
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Deleted all in cart' });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
