'use strict'

const messageModel = require("../models/Message");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");

module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    search: search
}

async function createOne(authUser, message, params, flags) {
    try {
        let result;

        result = await messageModel(message).save();

        //response
        return Promise.resolve({ code: 200, message: "one message created successfully", data: result });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data })
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a message: " + error })
        }
    }
}

async function deleteOne(authUser, message, params, flags) {
    try {
        let result;
        let deleteObj = {};

        deleteObj._id = message._messageId || params._messageId;

        result = await messageModel.deleteOne(deleteObj);

        return Promise.resolve({ code: 200, message: "Message deleted successfully", data: result })
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
        let result;
        let skipCount = 0;

        let messageQuery = {};
        
        if(message.messageIndex){
            skipCount = message.messageIndex * 5
        }
        
        // shall add other query params according to the need

        // Search
        result = await messageModel.find(messageQuery).sort({ '_id': -1 }).skip(skipCount).limit(5).populate('userId', 'username profile');    
        return Promise.resolve({ code: 200, message: "messages retrieved successfully.", data: result });
        
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while searching message: " + error, data: null });
        }
    }
}