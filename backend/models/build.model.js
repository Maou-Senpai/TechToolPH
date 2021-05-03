//const mongoose = require('mongoose');

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const buildSchema = new Schema({
    build_name:{
        type: String,
        required: true,
        trim:true
    },
    processor:{
        type: String,
        trim:true
    },
    graphics_card:{
        type: String,
        trim:true
    },
    motherboard:{
        type: String,
        trim: true
    },
    memory:{
        type: String,
        trim:true
    }
},{
    timestamps:true
});

const Build = mongoose.model('build',buildSchema);

//module.exports = Build;
export default Build