'use strict';
const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const blogSchema = new Schema(
  {
    description: String,
    ispopular: Boolean,
    link: String,
    category: [{ type: String }],
    logo: String,
    country: [{ type: String }],
    name: { type: String, unique: true },
    coupon: [{ type: Mongoose.Types.ObjectId, ref: 'coupons' }],
  },
  { timestamps: true }
);

module.exports = Mongoose.model('store', blogSchema);
