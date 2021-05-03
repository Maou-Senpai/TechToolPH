//const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        trim:true
    },
    password_hash:{
        type: String,
        required:true,
        trim:true
    },
    builds:{
        type: [String],
        trim:true
    }
},{
    timestamps:true
});

const User = mongoose.model('user',userSchema);

//module.exports = User;
export default User;