"use strict"
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
    category:String,
    subcategory:[
        {type:String}
    ],
    istravel:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = Mongoose.model('category', categorySchema);