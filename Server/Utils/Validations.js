"use strict"

const Mongoose = require('mongoose');

module.exports = {
    isNonEmptyObject: isNonEmptyObject,
    isValidMongoObjectId: isValidMongoObjectId,
    isNonEmptyArray: isNonEmptyArray
}

/**
 * Check if non-empty object
 * @param {*} obj 
 */
function isNonEmptyObject(obj) {
    if (obj && Object.keys(obj).length > 0) {
        return true;
    } else {
        return false;
    }
}

function isValidMongoObjectId(id) {
    return Mongoose.Types.ObjectId.isValid(id);
}

function isNonEmptyArray(arr) {
    if (arr && Array.isArray(arr) && arr.length > 0) {
        return true;
    } else {
        return false;
    }
}
