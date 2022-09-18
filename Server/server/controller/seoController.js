'use strict';

const verificationRequestHelper = require('../helpers/verificationRequestHelper');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const seoSchema = require('../models/Seo');
module.exports = {
  editSeo: editSeo,
  getSeo: getSeo,
};

async function editSeo(req, res) {
  const blogId = req.body.id;
  seoSchema.findByIdAndUpdate(
    blogId,
    req.body,
    { returnOriginal: 'after' },
    (err, doc) => {
      if (err)
        return res.status(400).json({
          status: 'FAILURE',
          message: 'INTERNAL SERVER ERROR!',
        });
      return res.status(200).json({
        status: 'SUCCESS',
        data: doc,
        message: 'SEO UPDATED SUCCESSFULLY!',
      });
    }
  );
}

async function getSeo(req, res) {
  const SEO = await seoSchema.find();
  if (!SEO) {
    throw new Error(`INTERNAL SERVER ERROR!`);
  }

  req.SEO = SEO;
  res.send(req.SEO);
}
