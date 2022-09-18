'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const imageSchema = new Schema(
  {
    image: {
      type: String,
    },
    type: {
      type: String,
      default: 'Other',
      enum: ['Other', 'SubmitBlog', 'Home'],
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model('image', imageSchema);
