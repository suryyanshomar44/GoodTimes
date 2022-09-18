const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const commentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blogs'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    username: {  //for guest user
        type: String,
        trim: true
    },
    comment: {
        type: String,
        required: [true, "Comment is missing"]
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isGuest: {
        type: Boolean
    }
});

module.exports = Mongoose.model('comments', commentSchema);