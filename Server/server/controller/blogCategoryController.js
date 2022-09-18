'use strict';
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const fs = require('fs').promises;
const blogCategoryHelper = require('../helpers/blogCategoryHelper');
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { categorydata } = require('../../Utils/constant');
const Category = require('../models/category');

module.exports = {
  getAll: getAll,
  update: update,
  promoteblogs,
  addSubcategory,
};

async function getAll(req, res) {
  try {
    let result, error, flags;
    [error, result] = await To(
      blogCategoryHelper.getAll(req.authUser, req.body, req.query, flags)
    );
    res
      .status(200)
      .send({
        code: 200,
        message: 'blog category fetched successfully',
        data: result.data,
      });
  } catch (error) {
    if (error && error.code && error.message) {
      res
        .status(error.code)
        .send({ code: error.code, message: error.message, data: error.data });
    } else {
      res
        .status(500)
        .send({
          code: 500,
          message: 'Error while fetching blog category' + error,
          data: null,
        });
    }
  }
}

async function update(req, res) {
  try {
    let error, result;
    if (!req.body) {
      throw new Error('No data', 400, null);
    }
    [error, result] = await To(
      blogCategoryHelper.update(req.authUser, req.body, req.params, req.flags)
    );
    res
      .status(200)
      .send({
        code: 200,
        message: 'Blog category updated successfully',
        data: result.data,
      });
  } catch (error) {
    if (error && error.code && error.message) {
      res
        .status(error.code)
        .send({ code: error.code, message: error.message, data: error.data });
    } else {
      res
        .status(500)
        .send({
          code: 500,
          message: 'Error while updating blog category' + error,
          data: null,
        });
    }
  }
}

async function promoteblogs(req, res) {
  try {
    let { blogids } = req.body;
    console.log(blogids);
    if (!blogids) {
      return res.status(400).json({ error: 'Blog id should be present!' });
    }
    if (!Array.isArray(blogids)) {
      return res.status(400).json({ error: ' Parameter should be an array !' });
    }

    if (blogids.length !== 5) {
      return res.status(400).json({ error: 'Number of blogs should be 5 !' });
    }

    let blogids1 = blogids.map((blog) => mongoose.Types.ObjectId(blog));

    await Blog.updateMany(
      { isPromoted: true },
      { $set: { isPromoted: false } }
    ); // setting other promoted blogs to false

    let findConditions = {
      _id: { $in: blogids1 },
    };

    let updates = {
      $set: {
        isPromoted: true,
      },
    };
    let updatedblog = await Blog.updateMany(findConditions, updates);
    if (!updatedblog) {
      return res.status(400).json({ error: "Couldn't Update Blog!" });
    }
    res
      .status(200)
      .json({
        message: 'Blog category updated successfully',
        data: updatedblog,
      });
  } catch (error) {
    if (error && error.code && error.message) {
      res
        .status(error.code)
        .send({ code: error.code, message: error.message, data: error.data });
    } else {
      res
        .status(500)
        .send({
          code: 500,
          message: 'Error while updating blog category' + error,
          data: null,
        });
    }
  }
}

async function addSubcategory(req, res) {
  try {
    let { subcategory, category } = req.body;
    console.log(subcategory, category);
    if (!subcategory || !category) {
      return res.status(400).json({ error: 'All fields should be given!' });
    }

    let ismatch = await Category.findOne({ category });
    if (!ismatch) {
      return res.status(400).json({ error: 'Category does not exist!' });
    }

    let updates = {
      $set: {
        subcategory,
      },
    };

    let updatedCategory = await Category.findOneAndUpdate(
      { category },
      updates,
      { new: true }
    );

    res
      .status(200)
      .json({
        message: 'Added subcategory successfuly!',
        data: updatedCategory,
      });
  } catch (error) {
    if (error && error.code && error.message) {
      res
        .status(error.code)
        .send({ code: error.code, message: error.message, data: error.data });
    } else {
      res
        .status(500)
        .send({
          code: 500,
          message: 'Error while updating blog category' + error,
          data: null,
        });
    }
  }
}
