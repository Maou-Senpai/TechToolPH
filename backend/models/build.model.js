//const mongoose = require('mongoose');

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const buildSchema = new Schema({
    build_name: {
        type: String,
        required: true,
        trim:true
    },
    build: {
        type: Object,
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
});

const Build = mongoose.model('build', buildSchema);

//module.exports = Build;
export default Build