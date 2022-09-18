'use strict';

const Moment = require('moment');
const momentTimezone = require('moment-timezone');
const APIFeatures = require('../../Utils/apiFeatures');
momentTimezone.tz.setDefault('Asia/Calcutta');
const couponHelper = require('../helpers/couponHelper');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');
const Coupon = require('../models/Coupon');
const Store = require('../models/store');
const { todayDate } = require('../../Utils/constant');
const Image = require('../models/publicimage');

module.exports = {
  createOne: createOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
  getAll: getAll,
  getOne: getOne,
  getCouponsViaCountry,
  getCouponsWithFilter,
  getSearchCoupons,
  getUnexpiredCoupons,
  addImage,
  getImages,
  getAllCoupons,
  searchStore,
};

async function searchStore(req, res) {
  // const pageSize = 10;
  // const page = Number(req.query.pageNumber) || 1;

  // const keyword = req.query.keyword
    // ? {
        // $or: [
          // {
            // name: {
              // $regex: req.query.keyword,
              // $options: 'i',

            // },
          // },
          // {
          //   category: {
          //     $regex: req.query.keyword,
          //     $options: 'i',
          //   },
          // },
        // ],
      // }
    // : {};
  const keyword = {
    category: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  }
  const count = await Store.countDocuments(keyword);
  const key = new RegExp(req.query.keyword);
  console.log(key);
  const coupons = await Store.find(keyword);
  const cateogories = []
  // .limit(pageSize)
  // .skip(pageSize * (page - 1))

  res.json({
    message: 'Successfuly Fetched!',
    // pages: Math.ceil(count / pageSize),
    // page,
    data: coupons,
  });
}

async function getAllCoupons(req, res) {
  try {
    const coupons = await Coupon.find({
      to: { $gt: Date.now() },
    });

    res.status(200).json({
      message: 'Successfuly Fetched!',
      result: coupons.length,
      data: coupons,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while creating a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function createOne(req, res) {
  try {
    let error, result, flags;

    req.body.from = Moment(req.body.from).valueOf();
    if (!req.body.from) {
      throw new Error('From date is either missing or invalid', 400, null);
    }
    req.body.to = Moment(req.body.to).valueOf();
    if (!req.body.to) {
      throw new Error('To date is either missing or invalid', 400, null);
    }

    if (req.body.from > req.body.to) {
      throw new Error('Invalid to and from dates', 400, null);
    }

    [error, result] = await To(
      couponHelper.createOne(req.authUser, req.body, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send(result);
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while creating a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function deleteOne(req, res) {
  try {
    let error, result, flags;

    if (!Validations.isValidMongoObjectId(req.params._couponId)) {
      throw new Error('Coupon id is either missing or invalid', 400, null);
    }

    [error, result] = await To(
      couponHelper.deleteOne(
        req.authUser,
        { _couponId: req.params._couponId },
        { _couponId: req.params._couponId },
        flags
      )
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send({
      code: 200,
      message: 'Coupon deleted successfully',
      data: result.data,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while deleting a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function updateOne(req, res) {
  try {
    let error, result, flags;

    req.body.from = Moment(req.body.from).valueOf();
    if (!req.body.from) {
      throw new Error('From date is either missing or invalid', 400, null);
    }
    req.body.to = Moment(req.body.to).valueOf();
    if (!req.body.to) {
      throw new Error('To date is either missing or invalid', 400, null);
    }
    if (req.body.from > req.body.to) {
      throw new Error('Invalid to and from dates', 400, null);
    }

    if (!req.body) {
      throw new Error('Required fields missing', 400, null);
    }

    [error, result] = await To(
      couponHelper.updateOne(req.authUser, req.body, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send(result);
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while updating coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getAll(req, res) {
  try {
    let error, result;
    let body = {},
      flags = {};

    if (!req.query.couponIndex || req.query.couponIndex < 0) {
      throw new Error('Coupon index is either missing or invalid', 400, null);
    } else {
      body.couponIndex = req.query.couponIndex;
    }

    if (!req.originalUrl.includes('admin')) {
      flags.isNotAdmin = true;
    }

    if (req.query.isExpired === 'true') {
      body.isExpired = true;
    } else if (req.query.isExpired === 'false') {
      body.isNonExpired = true;
    } else if (req.query.country) {
      body.country = req.query.country;
    } else if (req.query.brand) {
      body.brand = req.query.brand;
    } else if (req.query.search) {
      body.search = req.query.search;
    } else {
      throw new Error('Query is either missing or invalid', 400, null);
    }

    [error, result] = await To(
      couponHelper.search(req.authUser, body, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send(result);
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching coupons: ' + error,
        data: null,
      });
    }
  }
}

async function getOne(req, res) {
  try {
    let error, result, flags;

    if (!Validations.isValidMongoObjectId(req.params._couponId)) {
      throw new Error('Coupon id is either missing or invalid', 400, null);
    }

    [error, result] = await To(
      couponHelper.getOne(
        req.authUser,
        { _id: req.params._couponId },
        req.params,
        flags
      )
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send({
      code: 200,
      message: 'One coupon fetched successfully',
      data: result.data,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getCouponsViaCountry(req, res) {
  try {
    let { country, page } = req.body;
    let perpage = page ? 5 : 20;

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;

    let coupons = await Coupon.find({
      country: { $all: country },
      to: { $gt: Date.now() },
    })
      .skip(start)
      .limit(perpage);

    res.status(200).json({
      message: 'Successfuly Fetched!',
      result: coupons.length,
      data: coupons,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getCouponsWithFilter(req, res) {
  try {
    const features = new APIFeatures(Store.find().populate('coupon'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      message: 'Successfuly Fetched!',
      data: doc,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getSearchCoupons(req, res) {
  try {
    console.log(new Date());
    let { coupon, page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let couponregex = new RegExp(coupon, 'ig');

    let findConditions = {
      $or: [
        { brandName: { $regex: couponregex } },
        { deal: { $regex: couponregex } },
      ],
    };

    let coupons = await Coupon.find(findConditions).skip(start).limit(perpage);
    res.status(200).json({ message: 'Successfuly Fetched!', data: coupons });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getUnexpiredCoupons(req, res) {
  try {
    console.log(new Date());
    let { coupon, page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let couponregex = new RegExp(coupon, 'ig');

    // let findConditions={
    //     $or:[
    //         {brandName:{$regex:couponregex}},
    //         {deal:{$regex:couponregex}}
    //     ]
    // }

    let coupons1 = await Coupon.aggregate([
      { $addFields: { expirydate: { $add: [new Date(0), '$to'] } } },
      { $addFields: { date: { $subtract: [new Date(), '$expirydate'] } } },
      {
        $match: {
          date: { $lt: 0 },
          $or: [
            { brandName: { $regex: couponregex } },
            { deal: { $regex: couponregex } },
          ],
        },
      },
      { $skip: start },
      { $limit: perpage },
      // month : { $month : "$date" },
      // day : { $dayOfMonth : "$date" },
      // {$addFields:{ff:"$to"}},
      //{$addFields:{enddate:todayDate(new Date("$to"))}},
      // {$match:{enddate:{$lt:todayDate()}}}
    ]);

    //let coupons=await Coupon.find(findConditions).skip(start).limit(perpage);
    res.status(200).json({ message: 'Successfuly Fetched!', data: coupons1 });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function addImage(req, res) {
  try {
    let { images, type } = req.body;
    if (!images || !type) {
      return res.status(400).json({ error: 'All fields not present!' });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'images field should be array!' });
    }
    console.log(type);
    await Image.deleteMany({ type });

    await Promise.all(
      images.map(async (img) => {
        let imagecreated = new Image({
          image: img,
          type,
        });
        await imagecreated.save();
      })
    );

    res.status(200).json({ message: 'Successfuly Created!' });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}

async function getImages(req, res) {
  try {
    let { type } = req.query;
    if (!type) {
      return res.status(400).json({ error: 'All fields not present!' });
    }

    let images = await Image.find({ type });

    res.status(200).json({ message: 'Successfuly fetched!', data: images });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching a coupon: ' + error,
        data: null,
      });
    }
  }
}
