'use strict';
module.exports = {
  updateOne: updateOne,
  getStat: getStat,
};

const blogHelper = require('./blogHelper');
const statService = require('../services/statService');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const ObjectId = require('mongodb').ObjectId;

async function updateOne(authUser, stat, params, flag) {
  try {
    let error, result, blogResult;

    if (!params) {
      params = {};
    }
    if (!flag) {
      flag = {};
    }

    if (flag.isShareCount) {
      [error, blogResult] = await To(
        blogHelper.search(authUser, { _id: stat.blogId }, params, flag)
      );
      if (error) {
        throw new Error(error.message, error.code, error.data);
      }
      if (blogResult.data.length === 0) {
        throw new Error(`Invalid blog id`, 400, null);
      }

      if (blogResult.data[0]['userId']) {
        const d = new Date();

        stat.userId = blogResult.data[0]['userId'];
        stat.day = d.getDate();
        stat.month = d.getMonth() + 1;
        stat.year = d.getFullYear();
        stat.shareCount = 1;
      } else {
        return Promise.resolve({
          code: 200,
          message: 'stat updated successfully',
          data: false,
        });
      }
    }

    if (flag.isShareCount) {
      //updating share count in blog schema
      [error, result] = await To(
        blogHelper.updateOne(authUser, { _id: stat.blogId }, params, {
          isUpdateShareCount: true,
        })
      );
      if (error) {
        throw new Error(error.message, error.code, error.data);
      }
    }

    [error, result] = await To(
      statService.updateOne(authUser, stat, params, flag)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'stat updated successfully',
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
        message: 'Error while updating a stat: ' + error,
        data: null,
      });
    }
  }
}

async function getStat(authUser, stat, params, flag) {
  try {
    let error, result, pipeline;
    const d = new Date();

    if (flag.isTabular) {
      pipeline = [
        {
          $match: {
            userId: ObjectId(authUser.id),
            month: d.getMonth() + 1,
            year: d.getFullYear(),
          },
        },
        {
          $group: {
            _id: '$blogId',
            commentCount: { $sum: '$commentCount' },
            viewCount: { $sum: '$viewCount' },
            shareCount: { $sum: '$shareCount' },
          },
        },
        {
          $lookup: {
            from: 'blogs',
            localField: '_id',
            foreignField: '_id',
            as: 'blog',
          },
        },
        {
          $project: {
            _id: 0,
            commentCount: 1,
            viewCount: 1,
            shareCount: 1,
            blog: {
              title: 1,
              thumbnail: 1,
            },
          },
        },
      ];
      console.log(pipeline)
    } else if (flag.isAllTime) {
      pipeline = [
        {
          $match: { userId: ObjectId(authUser.id) },
        },
        {
          $group: {
            _id: '$userId',
            commentCount: { $sum: '$commentCount' },
            viewCount: { $sum: '$viewCount' },
            shareCount: { $sum: '$shareCount' },
          },
        },
      ];
      console.log(pipeline)
    } else if (flag.isGraph) {
      pipeline = [
        {
          $match: {
            userId: ObjectId(authUser.id), // user who is accessing
            month: d.getMonth() + 1, // current month (0-11 +1)
            year: d.getFullYear(), //current year
          },
        },
        {
          $group: {
            _id: '$day', // group by day & sum of comment, views & share
            commentCount: { $sum: '$commentCount' },
            viewCount: { $sum: '$viewCount' },
            shareCount: { $sum: '$shareCount' },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ];
    }

    [error, result] = await To(
      statService.getStat(authUser, pipeline, params, flag)
    );
    console.log("result",result)
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    if (flag.isGraph) {
      let dateArray = [];
      for (let i = 1; i <= d.getDate(); i++) {
        if (!result.data.find((obj) => obj._id === i)) {
          dateArray.push(i);
        }
      }
      for (let i = 0; i < dateArray.length; i++) {
        result.data.push({
          _id: dateArray[i],
          commentCount: 0,
          viewCount: 0,
          shareCount: 0,
        });
      }
      result.data.sort((a, b) => (a._id > b._id ? 1 : -1));
    }
    return Promise.resolve({
      code: 200,
      message: 'stat retrieved successfully',
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
        message: 'Error while updating a stat: ' + error,
        data: null,
      });
    }
  }
}
