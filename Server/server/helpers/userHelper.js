"use strict"

const userService = require("../services/userService");
const firebaseAdmin = require("../../firebaseConfig/adminConfig")
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const mongoose=require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET;


module.exports = {
    signup: signup,
    signin: signin,
    search: search,
    updateOne: updateOne
}

async function signup(authUser, user, params, flags) {
    try {

        let error, result, userResult, decodeValue;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        if (user.signupType === 'email') {
            user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10));
        }
        else if (user.signupType === 'gmail' || user.signupType === 'facebook') {
            // firebase authentication
            decodeValue = await firebaseAdmin.auth().verifyIdToken(user.firebaseToken);
            user.userId = decodeValue.email;
        }

        [error, userResult] = await To(userService.search(authUser, { userId: user.userId }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        if (userResult.data.length !== 0) {
            throw new Error(`There already exists an account with the given ${user.signupType} id`, 400, null);
        }

        delete user.firebaseToken;
        delete user.signupType;
        [error, result] = await To(userService.createOne(authUser, user, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        const accessToken = jwt.sign(
            {
                id: result.data._id,
                isAdmin: result.data.isAdmin
            },
            JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return Promise.resolve({ code: 200, message: "user signedup successfully.", data: result.data, accessToken });
    } catch (error) {
        if (error && (error.code === "auth/argument-error") && (error.message === "Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.")) {
            return Promise.reject({ code: 401, message: 'Authorization failed', data: error.data });
        }
        else if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        }
        else {
            return Promise.reject({ code: 500, message: "Error while signing up: " + error, data: null });
        }
    }
}

async function signin(authUser, user, params, flags) {
    try {
        let error, userResult, decodeValue;

        if (user.signinType === 'gmail' || user.signinType === 'facebook') {
            decodeValue = await firebaseAdmin.auth().verifyIdToken(user.firebaseToken);
            user.userId = decodeValue.email;
        }

        //checking if there is any user with the given credentials
        [error, userResult] = await To(userService.search(authUser, { userId: user.userId }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if (userResult.data.length === 0) {
            throw new Error(`No user exists with the given credentials`, 400, null);
        }
        // validating password : for email and password 
        if (user.signinType === 'email' && (!(Bcrypt.compareSync(user.password, userResult.data[0]["password"])))) {
            throw new Error("Incorrect password", 401, null);
        }

        const accessToken = jwt.sign(
            {
                id: userResult.data[0]['_id'],
                isAdmin: userResult.data[0]['isAdmin']
            },
            JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return Promise.resolve({ code: 200, message: "user signed in successfully.", data: userResult.data[0], accessToken });

    } catch (error) {
        if (error && (error.code === "auth/argument-error") && (error.message === "Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.")) {
            return Promise.reject({ code: 401, message: 'Authorization failed', data: error.data });
        }
        else if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        }
        else {
            return Promise.reject({ code: 500, message: "Error while signing in: " + error, data: null });
        }
    }
}

async function search( userAuth,user, params, flags) {
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
        [error, result] = await To(userService.search( userAuth,user, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve(result);

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while searching users: " + error });
        }
    }
}

async function updateOne( blogid, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(search( { '_id': mongoose.Types.ObjectId(blogid)  }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if (result.data.length === 0) {
            throw new Error(`No user exists with the given credentials`, 400, null);
        }

        // Update
        [error, result] = await To(userService.updateOne(authUser, user, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "user profile updated successfully.", data: result.data });

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while updating user profile: " + error, data: null });
        }
    }
}