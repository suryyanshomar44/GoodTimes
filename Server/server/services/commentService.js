'use strict'

const commentModel = require("../models/Comment");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");

module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    search: search,
    updateOne: updateOne
}

async function createOne(authUser, comment, params, flags) {
    try {
        let result;
        if(authUser.id != "6325db4be0bd0165d8bf8c38"){
            comment.isApproved = true;
        }
        result = await commentModel(comment).save();
         
        //response
        return Promise.resolve({ code: 200, message: "one comment created successfully", data: result });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data })
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a comment: " + error })
        }
    }
}

async function deleteOne(authUser, comment, params, flags) {
    try {
        let result;
        let deleteObj = {};

        deleteObj._id = comment._commentId || params._commentId;

        result = await commentModel.deleteOne(deleteObj);

        return Promise.resolve({ code: 200, message: "Comment deleted successfully", data: result })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while deleting a comment: " + error, data: null });
        }
    }
}

async function search(authUser, comment, params, flags) {
    try {
        let result;
        let skipCount = 0;

        let commentQuery = {};


        if (comment._id) {
            commentQuery._id = comment._id;
        }
        if (comment.userId) {
            commentQuery.userId = comment.userId;
        }
        if (comment.isApproved === 1) {
            commentQuery.isApproved = true;
        } 
        else if(comment.isApproved === 0){
            commentQuery.isApproved = false;
        }
        if (comment.blogId) {
            commentQuery.blogId = comment.blogId;
        }
        if(comment.commentIndex){
            skipCount = comment.commentIndex * 5
        }

        // shall add other query params according to the need

        // Since this is a Search API, atleast 1 search param is required
        if (Validations.isNonEmptyObject(commentQuery)) {

            // Search
            result = await commentModel.find(commentQuery).sort({ '_id': -1 }).skip(skipCount).limit(5).populate('userId', 'username profile');    
            return Promise.resolve({ code: 200, message: "Comments retrieved successfully.", data: result });

        } else {
            return Promise.reject({ code: 400, message: "No search keys found." });
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while searching comment: " + error, data: null });
        }
    }
}

async function updateOne(authUser, comment, params, flags) {
    try {
        let result;
        let updateObj = {};
        let query = {};

        query['_id'] = comment._commentId || params._commentId
        updateObj['$set'] = {};

        updateObj['$set']['isApproved'] = true;

        result = await commentModel.updateOne(query, updateObj);
        let com=await commentModel.findOne(query);
        if(com){
            await Blog.findOneAndUpdate({_id:mongoose.Types.ObjectId(com.blogId)},{$inc:{commentCount:1}});
        }
        

        return Promise.resolve({ code: 200, message: "Comment updated successfully.", data: result })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while updating comment: " + error, data: null });
        }
    }
}