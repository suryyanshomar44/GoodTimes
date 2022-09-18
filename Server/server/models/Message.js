"use strict"
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const messageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    username: {  //for guest user
        type: String,
        trim: true
    },
    email: {  // for guest user
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true,
        required: [true, "Subject is missing"]
    },
    message: {
        type: String,
        trim: true,
        required: [true, "Message is missing"]
    },    
    isGuest: { // to distinguish whether the message is of a guest or a registered user
        type: Boolean
    }
})

module.exports = Mongoose.model('messages', messageSchema);