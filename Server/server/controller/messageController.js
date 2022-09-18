'use strict'

const messageHelper = require("../helpers/messageHelper");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");

module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    getMessages: getMessages
}

async function createOne(req, res) {
    try {
        let error, result, flags;

        if (!req.body.subject) {
            throw new Error("Subject is either missing or invalid", 400, null);
        }
        if (!req.body.message) {
            throw new Error("Message is either missing or invalid", 400, null);
        }

        if (req.originalUrl === '/api/guest/message') {
            if (!req.body.username) {
                throw new Error("Username is either missing or invalid", 400, null);
            }
            if (!req.body.email) {
                throw new Error("Email is either missing or invalid", 400, null);
            }
            req.body.isGuest = true;
        } else {
            req.body.userId = req.authUser.id;
            req.body.isGuest = false;
        }

        [error, result] = await To(messageHelper.createOne(req.authUser, req.body, req.params, flags))
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }


        res.send({ code: 200, message: "Message created successfully", data: result.data })

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while creating a message: " + error, data: null });
        }
    }
}

async function deleteOne(req, res) {
    try {
        let error, result, flags;
        if (!Validations.isValidMongoObjectId(req.params._messageId)) {
            throw new Error("message id is either missing or invalid", 400, null);
        }

        [error, result] = await To(messageHelper.deleteOne(req.authUser, { _messageId: req.params._messageId }, { _messageId: req.params._messageId }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "message deleted successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while deleting a message: " + error, data: null });
        }
    }
}

async function getMessages(req, res) {
    try {
        let error, result, flags;


        if ((!req.query.messageIndex) || (req.query.messageIndex < 0)) {
            throw new Error("message index is either missing or invalid", 400, null);
        }

        [error, result] = await To(messageHelper.search(req.authUser, req.query, req.params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "messages fetched successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while fetching messages: " + error, data: null });
        }
    }
}