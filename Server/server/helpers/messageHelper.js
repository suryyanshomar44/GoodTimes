'use strict'
module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    search: search
}

const messageService = require("../services/messageService");
const userHelper = require("./userHelper");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");

async function createOne(authUser, message, params, flags) {
    try {
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        if (!message.isGuest) {
            [error, result] = await To(userHelper.search(authUser, { '_id': authUser.id }, params, flags));
            if (error) {
                throw new Error(error.message, error.code, error.data);
            }
            if (result.data.length === 0) {
                throw new Error(`User with the given credentials doesnt exist`, 400, null);
            }
        }

        [error, result] = await To(messageService.createOne(authUser, message, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "message created successfully", data: result.data });

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a message: " + error, data: null });
        }
    }
}

async function deleteOne(authUser, message, params, flags) {
    try {
        let error, result;
        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(messageService.deleteOne(authUser, message, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Message deleted successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while deleting a message: " + error, data: null });
        }
    }
}

async function search(authUser, message, params, flags) {
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
        [error, result] = await To(messageService.search(authUser, message, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve(result);

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while searching messages: " + error });
        }
    }
}