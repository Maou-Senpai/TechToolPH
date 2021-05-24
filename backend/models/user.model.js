//const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        trim:true
    },
    password:{
        type: String,
        required:true,
        trim:true
    },
},{
    timestamps:true
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('user',userSchema);

//module.exports = User;
export default User;