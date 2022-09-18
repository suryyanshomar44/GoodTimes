'use strict';
module.exports = {
  updateOne: updateOne,
  getStat: getStat,
};

const statModel = require('../models/Statistics');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');

async function updateOne(authUser, stat, params, flags) {
  try {
    let result;
    let updateObj = {};
    let query = {};

    if (stat.userId) {
      query.userId = stat.userId;
    }
    if (stat.blogId) {
      query.blogId = stat.blogId;
    }
    if (stat.day) {
      query.day = stat.day;
    }
    if (stat.month) {
      query.month = stat.month;
    }
    if (stat.year) {
      query.year = stat.year;
    }

    updateObj['$inc'] = {};

    if (stat.commentCount) {
      updateObj['$inc']['commentCount'] = 1;
    }
    if (stat.viewCount) {
      updateObj['$inc']['viewCount'] = 1;
    }
    if (stat.shareCount) {
      updateObj['$inc']['shareCount'] = 1;
    }

    result = await statModel.updateOne(query, updateObj, { upsert: true });

    return Promise.resolve({
      code: 200,
      message: 'stat updated successfully.',
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
        message: 'Error while updating stat: ' + error,
        data: null,
      });
    }
  }
}

async function getStat(authUser, stat, params, flags) {
  try {
    let result;
    result = await statModel.aggregate(stat);
    return Promise.resolve({
      code: 200,
      message: 'Stats fetched successfully',
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
        code: 409,
        message: 'Error while fetching stats: ' + error,
      });
    }
  }
}
