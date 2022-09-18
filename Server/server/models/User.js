"use strict"
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    userId: { // gmail|facebook|email
        type: String,
        required: [true, 'UserId is missing'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        minlength: [6, "username must be atleast 6 characters long"]
    },
    about: {
        type: String,
        trim: true,
        maxlength: [2000, "About cannot be more than 2000 characters long"]
    },
    profile: {
        type: String,
        trim: true
    },
    ratings : {
        count : {
            type: Number,
            default: 0
        },
        avg : {
            type: Number,
            default: 0
        }
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = Mongoose.model('users', userSchema)
