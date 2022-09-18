'use strict';

const statHelper = require('../helpers/statHelper');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');
const User = require('../models/User')
module.exports = {
  updateOne: updateOne,
  getStat: getStat,
};

async function updateOne(req, res) {
  try {
    let error, result;

    if (!req.params._blogId) {
      throw new Error('blog id is either missing or invalid', 400, null);
    }

    [error, result] = await To(
      statHelper.updateOne(
        req.authUser,
        { blogId: req.params._blogId },
        { blogId: req.params._blogId },
        { isShareCount: true }
      )
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send({
      code: 200,
      message: 'stat updated successfully',
      data: result.data,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while updating a stat: ' + error,
        data: null,
      });
    }
  }
}

async function getStat(req, res) {
  try {
    let error, result;
    let flag = {};
    console.log("req.body",req.body)
    console.log("req.query",req.query)
    if (req.query.isAllTime === 'true') {
      flag.isAllTime = true;
    } else if (req.query.isGraph === 'true') {
      flag.isGraph = true;
    } else if (req.query.isTabular === 'true') {
      flag.isTabular = true;
    } else {
      throw new Error('Invalid query type', 400, null);
    }

    [error, result] = await To(
      statHelper.getStat(req.authUser, req.body, req.params, flag)
    );
    console.log(error, result);
    if (error) {
      throw new Error(error.message, error.code, error.data, error.stack);
    }
    res.send({
      code: 200,
      message: 'stat fetched successfully',
      data: result.data,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({
        code: error.code,
        message: error.message,
        data: error.data,
        stack: error.stack,
      });
    } else {
      res.send({
        code: 500,
        message: 'Error while getting stats: ' + error,
        data: null,
      });
    }
  }
}

// async function getTabularData(res,res){
//   const user = await User.findById(req.authUser.id);
//   const blogs = await Blogs.find({userId:req.user._id})
// }

