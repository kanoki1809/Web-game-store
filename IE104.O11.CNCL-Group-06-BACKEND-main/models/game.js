const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    developer: {
      type: Date,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    saleoff: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldprice: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Tag',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
