require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Error = require('./Error');

module.exports = {
  authUser,
  adminAuth,
};

async function authUser(req, res, next) {
  try {
    const accessToken =
      req.cookies.accessToken || req.headers['x-access-token'];
    console.log(req.cookies)
    console.log(accessToken);

    if (accessToken) {
      // console.log(await jwt.verify(accessToken, JWT_SECRET));
      let data = await jwt.verify(accessToken, JWT_SECRET);
      req.authUser = {
        id: data.id,
        isAdmin: data.isAdmin,
      };

      next();
    } else {
      throw new Error('Authorizatin failed. Please sign in.', 401, null);
    }
  } catch (error) {
    if (error.message === 'TokenExpiredError') {
      res.send({
        code: 401,
        message: 'Access Token Expired. Please login',
        data: null,
      });
    } else if (error.message === 'invalid signature') {
      res.send({ code: 401, message: 'Invalid Token', data: null });
    } else if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while verifying token: ' + error,
        data: null,
      });
    }
  }
}

async function adminAuth(req, res, next) {
  try {
    if (!req.authUser.isAdmin) {
      throw new Error('Forbidden', 403, null);
    } else {
      next();
    }
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while authorising admin: ' + error,
        data: null,
      });
    }
  }
}
