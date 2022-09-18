'use strict'

const commentService = require("../services/commentService");
const blogHelper = require("../helpers/blogHelper");
const statHelper = require("../helpers/statHelper");
const userHelper = require("../helpers/userHelper");
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");

module.exports = {
    createOne: createOne,
    deleteOne: deleteOne,
    updateOne: updateOne,
    search: search
}

async function createOne(authUser, comment, params, flags) {
    try {
        let error, result, blogResult, commentResult;
        let commentStat = {};

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        if (!comment.isGuest) {
            [error, result] = await To(userHelper.search(authUser, { '_id': authUser.id }, params, flags));
            if (error) {
                throw new Error(error.message, error.code, error.data);
            }
            if (result.data.length === 0) {
                throw new Error(`User with the given credentials doesnt exist`, 400, null);
            }
        }else{
            throw new Error(`You Must Login first to comment on this blog`,401,null)
        }

        // Verifying whether the given blog exists
        [error, blogResult] = await To(blogHelper.search(authUser, {'_id':comment.blogId}, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if (blogResult.data.length === 0) {
            throw new Error(`Invalid blog id`, 400, null);
        }
        
        //create comment
        [error, commentResult] = await To(commentService.createOne(authUser, comment, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }  
        
        //updating comment count in stat
        if(blogResult.data[0]['userId']){
            const d = new Date();

            commentStat.userId = blogResult.data[0]['userId'];
            commentStat.blogId = comment.blogId,
            commentStat.day = d.getDate();
            commentStat.month = d.getMonth()+1;
            commentStat.year = d.getFullYear();
            commentStat.commentCount = 1;
            
            [error, result] = await To(statHelper.updateOne(authUser, commentStat, params, flags));
            if (error) {
                throw new Error(error.message, error.code, error.data);
            }
        }

        //updating comment count in blog schema
        [error, result] = await To(blogHelper.updateOne(authUser, {'_id': comment.blogId}, params, {'isUpdateCommentCount' : true}))
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "comment created successfully", data: commentResult.data });

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while creating a comment: " + error, data: null });
        }
    }
}

async function deleteOne(authUser, comment, params, flags) {
    try {
        let error, result;
        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(commentService.deleteOne(authUser, comment, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Comment deleted successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while deleting a comment: " + error, data: null });
        }
    }
}

async function updateOne(authUser, comment, params, flags) {
    try {
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        [error, result] = await To(search(authUser, {'_id':comment._commentId}, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }
        if(result.data.length === 0){
            throw new Error('Comment doesnt exist', 400, null);
        }

        [error, result] = await To(commentService.updateOne(authUser, comment, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve({ code: 200, message: "Comment updated successfully", data: result.data })
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while updating a comment: " + error, data: null });
        }
    }
}

async function search(authUser, comment, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }
        // TODO : Check if the given blog exist
        // Search
        [error, result] = await To(commentService.search(authUser, comment, params, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        return Promise.resolve(result);

    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while searching comments: " + error });
        }
    }
}
