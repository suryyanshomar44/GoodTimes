'use strict';

const blogModel = require('../models/Blog');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');
const Mongoose = require('mongoose');
const category = require('../models/category');

module.exports = {
  createOne: createOne,
  search: search,
  getOne: getOne,
  updateOne: updateOne,
  getHomepageBlogs: getHomepageBlogs,
};

async function createOne(authUser, blog, params, flags) {
  try {
    let result;

    let foundcategory = await category.findOne({ category: blog.category });
    if (!foundcategory) {
      throw new Error('category not found!');
    }
    if (!foundcategory.subcategory.includes(blog.subcategory)) {
      throw new Error("Subcategory doesn't exist!");
    }
    //console.log(authUser.isAdmin)

    let isApproved = true;
    console.log(authUser.id)
    if(authUser.id == "6325db4be0bd0165d8bf8c38"){
      isApproved = false;
      console.log("hi")
    }
    
    result = await blogModel({
      ...blog,
      category: blog.category,
      subcategory: blog.subcategory,
      isApproved: isApproved,
    }).save();
    //console.log(result)
    //response
    return Promise.resolve({
      code: 200,
      message: 'one blog created successfully',
      data: result,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      //console.log(error)
      return Promise.reject({
        code: 500,
        message: 'Error while creating a blog: ' + error,
      });
    }
  }
}

async function search(authUser, blog, params, flags) {
  try {
    let result;
    let skip = 0;

    let blogQuery = {};

    let project = {
      title: 1,
      thumbnail: 1,
      blogText: 1,
      userId: 1,
      shareCount: 1,
      viewCount: 1,
      commentCount: 1,
    };

    if (blog.userId) {
      blogQuery.userId = blog.userId;
    }
    if (blog._id) {
      blogQuery._id = blog._id;
    }

    if (blog.isApproved === 1) {
      blogQuery.isApproved = true;
    } else if (blog.isApproved === 0) {
      blogQuery.isApproved = false;
    }

    if (blog.isGuest === 1) {
      blogQuery.isGuest = true;
    } else if (blog.isGuest === 0) {
      blogQuery.isGuest = false;
    }

    if (blog.isDraft === 1) {
      blogQuery.isDraft = true;
    } else if (blog.isDraft === 0) {
      blogQuery.isDraft = false;
    }

    if (blog.blogIndex) {
      skip = blog.blogIndex * 5;
    }

    // shall add other query params according to the need

    // Since this is a Search API, atleast 1 search param is required
    if (Validations.isNonEmptyObject(blogQuery)) {
      // Search
      result = await blogModel
        .find(blogQuery, project)
        .populate({ path: 'userId', model: 'users' })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(5);

      return Promise.resolve({
        code: 200,
        message: 'Blogs retrieved successfully.',
        data: result,
      });
    } else {
      return Promise.reject({ code: 400, message: 'No search keys found.' });
    }
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 500,
        message: 'Error while searching blog: ' + error,
        data: null,
      });
    }
  }
}

async function getOne(authUser, blog, params, flags, dynamicUrl) {
  try {
    let result;
    let query = {};
    if (dynamicUrl.length === 0) {
      query._id = params._blogId || blog._blogId;
    } else {
      query.dynamicUrl = dynamicUrl;
    }
    // console.log(query);
    dynamicUrl.length === 0
      ? (result = await blogModel
          .findOne(query)
          .populate('userId', 'username profile about isverified ratings'))
      : (result = await blogModel
          .find(query)
          .populate('userId', 'username profile about isverified ratings'));

    if (result) {
      console.log(result);
      return Promise.resolve({
        code: 200,
        message: 'One blog retrieved successfully.',
        data: result,
      });
    } else {
      throw new Error('Invalid blog id', 500, null);
    }
  } catch (error) {
    if (error && error.code && error.message) {
      console.log(error, error.code, error.message);
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 500,
        message: 'Error while retrieving one blog: ' + error,
      });
    }
  }
}

async function updateOne(authUser, blog, params, flags) {
  try {
    let result,
      query = {},
      updateObj = {};
    (updateObj['$set'] = {}), (updateObj['$inc'] = {});

    if (blog._id) {
      query._id = blog._id;
    }
    if (flags.isApproveBlog) {
      updateObj['$set']['isApproved'] = true;
    }
    if (flags.isUpdateCommentCount) {
      updateObj['$inc']['commentCount'] = 1;
    }
    if (flags.isUpdateViewCount) {
      updateObj['$inc']['viewCount'] = 1;
    }
    if (flags.isUpdateShareCount) {
      updateObj['$inc']['shareCount'] = 1;
    }

    result = await blogModel.updateOne(query, updateObj);

    //response
    return Promise.resolve({
      code: 200,
      message: 'one blog updated successfully',
      data: result,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 500,
        message: 'Error while updating a blog: ' + error,
      });
    }
  }
}

async function getHomepageBlogs(authUser, blog, params, flags) {
  try {
    let result;
    let blogQuery = {
      isApproved: true,
      isDraft: false,
    };

    let project = {
      thumbnail: 1,
      blogText: 1,
      title: 1,
      category: 1,
    };

    result = await blogModel
      .find(blogQuery, project)
      .sort({ viewCount: -1 })
      .limit(25);
    return Promise.resolve({
      code: 200,
      message: 'Homepage blogs fetched successfully',
      data: result,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
      });
    }
  }
}
