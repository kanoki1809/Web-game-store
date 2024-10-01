const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Game',
    },
  ],
  cart: {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
      },
    ],
  },
});

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
