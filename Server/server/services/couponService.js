'use strict';

const couponModel = require('../models/Coupon');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');
const Moment = require('moment');
const momentTimezone = require('moment-timezone');
momentTimezone.tz.setDefault('Asia/Calcutta');
const Store = require('../models/store');
const mongoose = require('mongoose');

module.exports = {
  createOne: createOne,
  deleteOne: deleteOne,
  search: search,
  updateOne: updateOne,
  getOne: getOne,
};

async function createOne(authUser, coupon, params, flags) {
  try {
    let result;

    result = await couponModel(coupon).save();
    let update = {
      $push: {
        coupon: result._id,
      },
    };
    await Store.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(coupon.storeid) },
      update,
      { new: true }
    );
    //response
    return Promise.resolve({
      code: 200,
      message: 'one coupon created successfully',
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
        message: 'Error while creating a coupon: ' + error,
      });
    }
  }
}

async function getOne(authUser, coupon, params, flags) {
  try {
    let result;

    result = await couponModel.findOne({
      _id: coupon._id,
      to: { $gt: Moment().valueOf() },
    });
    if (!result) {
      throw new Error('Coupon Expired', 400, null);
    } else {
      //response
      return Promise.resolve({
        code: 200,
        message: 'one coupon fetched successfully',
        data: result,
      });
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
        message: 'Error while fetching one coupon: ' + error,
      });
    }
  }
}

async function deleteOne(authUser, coupon, params, flags) {
  try {
    let result;
    let deleteObj = {};

    deleteObj._id = coupon._couponId || params._couponId;

    result = await couponModel.deleteOne(deleteObj);

    return Promise.resolve({
      code: 200,
      message: 'Coupon deleted successfully',
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
        message: 'Error while deleting a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function search(authUser, coupon, params, flags) {
  try {
    let result;
    let skipCount = 0;

    let couponQuery = {},
      project = {};

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    if (coupon._id) {
      couponQuery._id = coupon._id;
    }
    if (coupon.isExpired) {
      couponQuery.to = { $lt: Moment().valueOf() };
    }
    if (coupon.isNonExpired) {
      couponQuery.to = { $gt: Moment().valueOf() };
    }
    if (coupon.brand) {
      couponQuery.brandName = { $regex: `${coupon.brand}`, $options: 'i' };
    } else if (coupon.search) {
      couponQuery.brandName = { $regex: `${coupon.search}`, $options: 'i' };
    }
    if (coupon.country) {
      couponQuery.country = { $regex: `${coupon.country}`, $options: 'i' };
    } else if (coupon.search) {
      couponQuery.country = { $regex: `${coupon.search}`, $options: 'i' };
    }
    if (coupon.couponIndex) {
      skipCount = coupon.couponIndex * 6;
    }

    if (flags.isNotAdmin) {
      project.websiteLink = 0;
      project.couponCode = 0;
    }
    // shall add other query params according to the need

    // Since this is a Search API, atleast 1 search param is required
    if (Validations.isNonEmptyObject(couponQuery)) {
      // Search
      result = await couponModel
        .find(couponQuery, project)
        .sort({ _id: -1 })
        .skip(skipCount)
        .limit(6);
      return Promise.resolve({
        code: 200,
        message: 'Coupons retrieved successfully.',
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
        message: 'Error while searching coupon: ' + error,
        data: null,
      });
    }
  }
}

async function updateOne(authUser, coupon, params, flags) {
  try {
    let result, couponBody;

    couponBody = new couponModel(coupon);
    couponBody.isNew = false;
    //update
    result = await couponBody.save();

    return Promise.resolve({
      code: 200,
      message: 'Coupon updated successfully',
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
        message: 'Error while updating coupon: ' + error,
        data: null,
      });
    }
  }
}
