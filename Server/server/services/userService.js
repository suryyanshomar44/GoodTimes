'use strict'

const userModel = require("../models/User");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");

module.exports = {
    createOne: createOne,
    search: search,
    updateOne: updateOne
}

async function createOne(authUser, user, params, flags) {
    try {
        let result;

        result = await userModel(user).save();

        //response
        return Promise.resolve({ code: 200, message: "one user created successfully", data: result });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data })
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a user: " + error })
        }
    }
}

async function search(authUser, user, params, flags) {
    try {
        let result;

        let userQuery = {};

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        if (user._id) {
            userQuery._id = user._id;
        }
        if (user.userId) {
            userQuery.userId = user.userId;
        }
        if (user.username) {
            userQuery.username = user.username;
        }
        if (user.isAdmin === 1) {
            userQuery.isAdmin = true;
        }
        else if (user.isAdmin === 0) {
            userQuery.isAdmin = false;
        }
        if (user.isverified === 1) {
            userQuery.isverified = true;
        }
        else if (user.isverified === 0) {
            userQuery.isverified = false;
        }
        // shall add other query params according to the need

        // Since this is a Search API, atleast 1 search param is required
        if (Validations.isNonEmptyObject(userQuery)) {

            // Search
            result = await userModel.find(userQuery)

            return Promise.resolve({ code: 200, message: "Users retrieved successfully.", data: result });

        } else {
            return Promise.reject({ code: 400, message: "No search keys found." });
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while searching user: " + error, data: null });
        }
    }
}

async function updateOne(authUser, user, params, flags) {
    try {
        let result, userResult, error;

        [error, userResult] = await To(search(authUser, { '_id': params._userId }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        if (user.username) {
            userResult.data[0].username = user.username;
        }
        if (user.about) {
            userResult.data[0].about = user.about;
        }
        if (user.profile) {
            userResult.data[0].profile = user.profile
        }
        if (flags.isVerifyUser) {
            userResult.data[0].isverified = true
        }
        if (flags.isRatings) {
            userResult.data[0].ratings.count = userResult.data[0].ratings.count + 1;
            userResult.data[0].ratings.avg = (userResult.data[0].ratings.avg * (userResult.data[0].ratings.count - 1) + user.ratings) / userResult.data[0].ratings.count;
        }

        result = await userModel(userResult.data[0]).save();

        return Promise.resolve({ code: 200, message: "User profile updated successfully", data: result });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while updating user profile: " + error, data: null });
        }
    }
}