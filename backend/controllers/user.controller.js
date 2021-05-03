//let User = require('../models/user.model');

import User from '../models/user.model.js';

const getUsers = (req,res)=>{
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getUser =  (req,res)=>{
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error :' + err));
};

const deleteUser = (req,res)=>{
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json('User was deleted'))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getUserBuilds = (req,res)=>{
    User.find()
        .then(user => res.json(user.builds))
        .catch(err => res.status(400).json('Error :'+ err));
};

const signup = (req,res)=>{
    const username = req.body.username;
    const password_hash = req.body.password_hash;
    const builds = req.body.builds;

    const newUser = new User({
        username,password_hash,builds
    });

    newUser.save()
        .then(user => res.json('New record added!'))
        .catch(err => res.status(400).json('Error'+err));
};

export default {
    getUsers,
    getUser,
    deleteUser,
    signup,
    getUserBuilds
}