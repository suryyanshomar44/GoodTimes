'use strict'

const commentHelper = require("../helpers/commentHelper");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");
const Blog = require("../models/Blog");
const mongoose=require('mongoose')

module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    updateOne: updateOne,
    getComments: getComments
}

async function createOne(req, res) {
    try {
        let error, result;

        if (!req.body.comment) {
            throw new Error("Comment is either missing or invalid", 400, null);
        }
        if (!req.body.blogId) {
            throw new Error("Blog id is either missing or invalid", 400, null);
        }
        if (req.originalUrl === '/api/guest/comment') {
            if (!req.body.username) {
                throw new Error("Username is either missing or invalid", 400, null);
            }
            req.body.isGuest = true
        } else {
            req.body.isGuest = false;
            req.body.userId = req.authUser.id
        }

        [error, result] = await To(commentHelper.createOne(req.authUser, req.body, req.params, req.body.flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        // await Blog.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.body.blogId)},{$inc:{commentCount:1}});

        res.send({ code: 200, message: "Comment posted successfully", data: {} })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while creating a comment: " + error, data: null });
        }
    }
}

async function deleteOne(req, res) {
    try {
        let error, result, flags;
        if (!req.params._commentId) {
            throw new Error("Comment id is either missing or invalid", 400, null);
        }

        [error, result] = await To(commentHelper.deleteOne(req.authUser, { _commentId: req.params._commentId }, { _commentId: req.params._commentId }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "Comment deleted successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while deleting a comment: " + error, data: null });
        }
    }
}

async function updateOne(req, res) {
    try {
        let error, result, flags;

        if (!req.params._commentId) {
            throw new Error("Comment id is either missing or invalid", 400, null);
        }

        [error, result] = await To(commentHelper.updateOne(req.authUser, { _commentId: req.params._commentId }, { _commentId: req.params._commentId }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "Comment updated successfully", data: {} })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while updating a comment: " + error, data: null });
        }
    }
}

async function getComments(req, res) {
    try {
        let error, result, flags, body;


        if (!req.params.commentIndex) {
            throw new Error("comment index is either missing or invalid", 400, null);
        }

        if (req.originalUrl.includes('admin')) {
            body = {
                'isApproved': 0,
                'commentIndex': req.params.commentIndex
            }
        } else {

            if (!Validations.isValidMongoObjectId(req.params._blogId)) {
                throw new Error("blog id is either missing or invalid", 400, null);
            }

            body = {
                'blogId': req.params._blogId,
                'isApproved': 1,
                'commentIndex': req.params.commentIndex
            }
        }

        [error, result] = await To(commentHelper.search(req.authUser, body, req.params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "Comments fetched successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while fetching comments: " + error, data: null });
        }
    }
}