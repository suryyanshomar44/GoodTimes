'use strict'

const verificationRequestHelper = require("../helpers/verificationRequestHelper")
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations")

module.exports = {
    createOne: createOne,
    getAll: getAll,
    deleteOne: deleteOne,
    approveOne: approveOne
}

async function createOne(req, res) {
    try {
        let error, result, flags;

        [error, result] = await To(verificationRequestHelper.createOne(req.authUser, req.body, req.params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send(result)
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while processing verification request: " + error, data: null });
        }
    }
}

async function getAll(req, res) {
    try {
        let error, result, flags;

        if ((!req.query.verificationRequestIndex) || (req.query.verificationRequestIndex < 0)) {
            throw new Error("Verification Request Index is either missing or invalid", 400, null);
        }

        [error, result] = await To(verificationRequestHelper.search(req.authUser, { verificationRequestIndex: req.query.verificationRequestIndex }, req.params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "Verification requests fetched successfully", data: result.data });
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while fetching verification requests: " + error, data: null });
        }
    }
}

async function deleteOne(req, res) {
    try {
        let error, result, flags;

        if (!Validations.isValidMongoObjectId(req.params._verificationRequestId)) {
            throw new Error("Verification Request ID is either missing or invalid", 400, null);
        }

        [error, result] = await To(verificationRequestHelper.deleteOne(req.authUser, { _id: req.params._verificationRequestId }, { _id: req.params._verificationRequestId }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "Verification request rejected successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while deleting a verification request  " + error, data: null });
        }
    }
}

async function approveOne(req, res) {
    try {
        let error, result, flags;

        if (!Validations.isValidMongoObjectId(req.params._verificationRequestId)) {
            throw new Error("Verification Request ID is either missing or invalid", 400, null);
        }

        [error, result] = await To(verificationRequestHelper.approveOne(req.authUser, { _id: req.params._verificationRequestId }, { _id: req.params._verificationRequestId }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "User verified successfully", data: null })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while verifying user  " + error, data: null });
        }
    }
}