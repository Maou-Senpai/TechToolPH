//const mongoose = require('mongoose');

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    item_name:{
        type: String,
        required:true,
        trim:true
    },
    price:{
        type: Number,
        required:true,
        trim:true
    }
},{
    timestamps:true
});

const Product = mongoose.model('product',productSchema);

//module.exports = Person;
export default Product;