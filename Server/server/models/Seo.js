'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const seoSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  keywords: {
    type: String,
  },
});

module.exports = Mongoose.model('seo', seoSchema);
