'use strict'

const verificationRequestModel = require("../models/verificationRequest");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");

module.exports = {
    createOne: createOne,
    search: search,
    deleteOne: deleteOne,
    getOne: getOne
}

async function createOne(authUser, verificationRequest, params, flags) {
    try {
        let result;

        result = await verificationRequestModel(verificationRequest).save();

        //response
        return Promise.resolve({ code: 200, message: "one verificationRequest created successfully", data: result });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data })
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a verificationRequest: " + error })
        }
    }
}

async function getOne(authUser, verificationRequest, params, flags) {
    try {
        let result;

        result = await verificationRequestModel.findOne({ '_id': verificationRequest._id });

        if (result) {
            return Promise.resolve({ code: 200, message: "one verificationRequest fetched successfully", data: result });
        } else {
            return Promise.reject({ code: 400, message: "No verification request exists with the given id" })
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data })
        } else {
            return Promise.reject({ code: 500, message: "Error while fetching a verificationRequest: " + error })
        }
    }
}

async function search(authUser, verificationRequest, params, flags) {
    try {
        let result;
        let skipCount = 0;

        let verificationRequestQuery = {};

        if (verificationRequest.userId) {
            verificationRequestQuery.userId = verificationRequest.userId;
        }
        if (verificationRequest.verificationRequestIndex) {
            skipCount = verificationRequest.verificationRequestIndex * 5;
        }

        // shall add other query params according to the need

        // Since this is a Search API, atleast 1 search param is required        

        // Search
        result = await verificationRequestModel.find(verificationRequestQuery).sort({ '_id': -1 }).skip(skipCount).limit(5).populate('userId', 'username profile about');
        return Promise.resolve({ code: 200, message: "Verification Request retrieved successfully.", data: result });

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while searching verificationRequest: " + error, data: null });
        }
    }
}

async function deleteOne(authUser, verificationRequest, params, flags) {
    try {
        let result;
        let deleteObj = {};

        deleteObj._id = verificationRequest._id || params._id

        result = await verificationRequestModel.deleteOne(deleteObj);

        return Promise.resolve({ code: 200, message: "Verification request deleted successfully", data: result })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while deleting a verificationRequest: " + error, data: null });
        }
    }
}