'use strict';
module.exports = {
  createOne: createOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
  getOne: getOne,
  search: search,
};

const Moment = require('moment');
const momentTimezone = require('moment-timezone');
momentTimezone.tz.setDefault('Asia/Calcutta');
const couponService = require('../services/couponService');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');

async function createOne(authUser, coupon, params, flags) {
  try {
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      couponService.createOne(authUser, coupon, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'coupon created successfully',
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
        message: 'Error while creating a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function deleteOne(authUser, coupon, params, flags) {
  try {
    let error, result;
    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      couponService.deleteOne(authUser, coupon, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'Coupon deleted successfully',
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
        message: 'Error while deleting a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function search(authUser, coupon, params, flags) {
  try {
    // Initialize
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    // Search
    [error, result] = await To(
      couponService.search(authUser, coupon, params, flags)
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
        message: 'Error while searching coupons: ' + error,
      });
    }
  }
}

async function updateOne(authUser, coupon, params, flags) {
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
      search(authUser, { _id: coupon._id }, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }
    if (result.data.length === 0) {
      throw new Error(`No coupon exists with the given credentials`, 400, null);
    }
    // Create
    [error, result] = await To(
      couponService.updateOne(authUser, coupon, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'Coupon updated successfully.',
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
        message: 'Error while updating coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getOne(authUser, coupon, params, flags) {
  try {
    let error, result;

    if (!params) {
      params = {};
    }
    if (!flags) {
      flags = {};
    }

    [error, result] = await To(
      couponService.getOne(authUser, coupon, params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    return Promise.resolve({
      code: 200,
      message: 'one coupon fetched successfully',
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
        message: 'Error while fetching one coupon: ' + error,
        data: null,
      });
    }
  }
}
