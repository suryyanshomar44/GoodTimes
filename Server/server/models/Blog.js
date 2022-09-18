'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const blogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    username: {
      //for guest user
      type: String,
      trim: true,
    },
    about: {
      // for guest user
      type: String,
      trim: true,
      maxlength: [2000, 'About cannot be more than 2000 characters long'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is missing'],
    },
    traveltheme: String,
    category: String,
    subcategory: String,
    content: {
      type: String,
      trim: true,
      required: [true, 'Content is missing'],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    blogText: {
      type: String,
      trim: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isGuest: {
      // to distinguish whether the blog is of a guest or a registered user
      type: Boolean,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    ratings: {
      rating: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: Boolean,
      default: false,
    },
    isRatings: {
      type: Boolean,
      default: false,
    },
    thingsToDo: {
      type: Boolean,
      default: false,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: String,
      trim: true,
    },
    dynamicUrl:{
      type: String,
      trim: true,
      unique:true,
    }
  },
  { timestamps: true }
);

module.exports = Mongoose.model('blogs', blogSchema);
