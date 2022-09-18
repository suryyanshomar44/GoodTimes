'use strict';
module.exports = {
  createOne: createOne,
  search: search,
  getOne: getOne,
  updateOne: updateOne,
  getHomepageBlogs: getHomepageBlogs,
};

const blogService = require('../services/blogService');
const userModel = require('../models/User')
const userHelper = require('../helpers/userHelper');
const statHelper = require('../helpers/statHelper');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');

async function createOne(authUser, blog, params, flags) {
  try {
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }
    //console.log(blog)
    if (!blog.isGuest) {
      const user = await userModel.findById(authUser.id);
      console.log(user)
      if(!user){
        throw new Error(
                `User with the given credentials doesnt exist`,
                400,
                user
              );
      }
      // userModel.findOne({_id: authUser.id, isAdmin:authUser.isAdmin}, (err, doc)=>{
      //   error = err;
      //   result = doc;
      //   if (err) {
      //     throw new Error(error.message, error.code, error.data);
      //   }
      //   if (!doc) {
      //     throw new Error(
      //       `User with the given credentials doesnt exist`,
      //       400,
      //       doc
      //     );
      //   }
      // })
        // userHelper.search(authUser, { _id: authUser.id }, params, flags)
     
    }else{
      const user = await userModel.findById("6325db4be0bd0165d8bf8c38");
      console.log(user)
      authUser = user
      //console.log(user)
    }

    [error, result] = await To(
      blogService.createOne(authUser, blog, params, flags)
    );
    // console.log(error)
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'Blog created successfully',
      data: result.data,
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
        message: 'Error while creating a blog: ' + error,
        data: null,
      });
    }
  }
}

async function search(authUser, blog, params, flags) {
  try {
    // Initialize
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      blogService.search(authUser, blog, params, flags)
    );

    if (error) {
      throw new Error(error.message, error.code, error.data);
    }
    // console.log(result);
    return Promise.resolve(result);
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 409,
        message: 'Error while searching blogs: ' + error,
      });
    }
  }
}

async function getHomepageBlogs(authUser, blog, params, flags) {
  try {
    // Initialize
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      blogService.getHomepageBlogs(authUser, blog, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve(result);
  } catch (error) {
    if (error && error.code && error.message) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } else {
      return Promise.reject({
        code: 409,
        message: 'Error while fetching homepage blogs: ' + error,
      });
    }
  }
}

async function getOne(authUser, blog, params, flags,dynamicUrl) {
  try {
    // Initialize
    let error, result, blogResult;
    let commentStat = {};

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }
    if (!dynamicUrl) {
      dynamicUrl = [];
    }
    // fetch
    [error, blogResult] = await To(
      blogService.getOne(authUser, blog, params, flags,dynamicUrl)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    //updating view count in stat
    if (blogResult.data['userId'] && blogResult.data['isApproved']) {
      const d = new Date();

      commentStat.userId = blogResult.data['userId']['_id'];
      (commentStat.blogId = params._blogId), (commentStat.day = d.getDate());
      commentStat.month = d.getMonth() + 1;
      commentStat.year = d.getFullYear();
      commentStat.viewCount = 1;

      [error, result] = await To(
        statHelper.updateOne(authUser, commentStat, params, flags)
      );
      if (error) {
        throw new Error(error.message, error.code, error.data);
      }
    }

    if (blogResult.data['isApproved']) {
      //updating view count in blog schema
      [error, result] = await To(
        updateOne(authUser, { _id: params._blogId }, params, {
          isUpdateViewCount: true,
        })
      );
      if (error) {
        throw new Error(error.message, error.code, error.data);
      }
    }

    return Promise.resolve({
      code: blogResult.code,
      message: blogResult.message,
      data: blogResult.data,
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
        message: 'An error occured while retrieving one blog: ' + error,
        data: null,
      });
    }
  }
}

async function updateOne(authUser, blog, params, flags) {
  try {
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      search(authUser, { _id: blog._id }, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }
    if (result.data.length === 0) {
      throw new Error('Invalid blog id', 400, null);
    }

    [error, result] = await To(
      blogService.updateOne(authUser, blog, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'Blog updated successfully',
      data: result.data,
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
        data: null,
      });
    }
  }
}
