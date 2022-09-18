const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const verificationRequestSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = Mongoose.model('verificationRequests', verificationRequestSchema);
