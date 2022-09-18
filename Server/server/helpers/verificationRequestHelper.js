"use strict"

const verificationRequestService = require("../services/verificationRequestService");
const userHelper = require("../helpers/userHelper");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");

module.exports = {
    createOne: createOne,
    search: search,
    deleteOne: deleteOne,
    getOne: getOne,
    approveOne: approveOne
}

async function createOne(authUser, verificationRequest, params, flags) {
    try {
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        //Checking whether the user is already verified
        [error, result] = await To(userHelper.search(authUser, { '_id': authUser.id, isverified: 1 }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if (result.data.length !== 0) {
            throw new Error(`You are already a verified user`, 400, null);
        }

        //Checking whether the verification request is still pending
        [error, result] = await To(search(authUser, { 'userId': authUser.id }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if (result.data.length !== 0) {
            throw new Error(`Verification Request is pending`, 400, null);
        }

        [error, result] = await To(verificationRequestService.createOne(authUser, { 'userId': authUser.id }, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Verification request created successfully", data: result.data });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while processing verification request: " + error, data: null });
        }
    }
}

async function search(authUser, verificationRequest, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(verificationRequestService.search(authUser, verificationRequest, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve(result);

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while searching verification request: " + error });
        }
    }
}

async function deleteOne(authUser, verificationRequest, params, flags) {
    try {
        let error, result;
        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(verificationRequestService.deleteOne(authUser, verificationRequest, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Verification request deleted successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while deleting a verificationRequest: " + error, data: null });
        }
    }
}

async function getOne(authUser, verificationRequest, params, flags) {
    try {
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(verificationRequestService.getOne(authUser, verificationRequest, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Verification request fetched successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while fetching a verificationRequest: " + error, data: null });
        }
    }
}

async function approveOne(authUser, verificationRequest, params, flags) {
    try {
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        //fetching verification request
        [error, result] = await To(getOne(authUser, verificationRequest, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        //updating user status
        [error, result] = await To(userHelper.updateOne(authUser, verificationRequest, { '_userId': result.data.userId }, { isVerifyUser: true }));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        //deleting the verification request
        [error, result] = await To(deleteOne(authUser, verificationRequest, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "User verified successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while verifying user: " + error, data: null });
        }
    }
}