const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let couponSchema = new Schema({
  brandName: {
    type: String,
    trim: true,
    required: [true, 'Brand Name is missing'],
  },
  country: [
    {
      type: String,
      trim: true,
    },
  ],
  isTopRecomendation: Boolean,
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is missing'],
  },
  websiteLink: {
    type: String,
    trim: true,
    required: [true, 'Website link is missing'],
  },
  bio: {
    type: String,
    trim: true,
    required: [true, 'Bio is missing'],
  },
  couponCode: {
    type: String,
    trim: true,
    required: [true, 'Coupon code is missing'],
  },
  deal: {
    type: String,
    trim: true,
    required: [true, 'Deal is missing'],
  },
  image: {
    type: String,
    trim: true,
    required: [true, 'Image is missing'],
  },
  from: {
    type: Number,
    required: ['true', 'From date is missing'],
  },
  to: {
    type: Number,
    required: ['true', 'To date is missing'],
  },
});

module.exports = Mongoose.model('coupons', couponSchema);
