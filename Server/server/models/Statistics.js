const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const statSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required : [true, "User id is missing"]
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'blogs',
        required : [true, "Blog id is missing"]
    },
    day : {
        type : Number,
        required : [true, "Day is missing"]
    },
    month : {
        type : Number,
        required : [true, "Month is missing"]
    },
    year : {
        type : Number,
        required : [true, "Year is missing"]
    },
    commentCount : {
        type: Number,
        default : 0
    },
    viewCount : {
        type: Number,
        default : 0
    },
    shareCount : {
        type: Number,
        default : 0
    }
});

module.exports = Mongoose.model('stats', statSchema);
