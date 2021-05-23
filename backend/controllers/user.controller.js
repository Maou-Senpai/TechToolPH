//let User = require('../models/user.model');
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

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

const login =  async (req, res) => {
    try {
        const { username, password } = req.body;

        // validate
        if (!username || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ username: username });
        if (!user)
            return res
                .status(400)
                .json({ msg: "No account with this username has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const signup = (req,res)=>{
    let { username, password, passwordCheck } = req.body;

    if (!username || !password || !passwordCheck)
        return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
        return res
            .status(400)
            .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
        return res
            .status(400)
            .json({ msg: "Enter the same password twice for verification." });

    username = username.trim();

    User.find({
        username: username
    }, (err, previousUsers)=> {
        if (err) {
            res.send({
                success: false,
                message: "Error: Server Error."
            });
        } else if (previousUsers.length > 0) {
            res.send({
                success: false,
                message: "Error: Account already exists."
            });
        }
        else{
            const newUser = new User();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);

            newUser.save()
                .then(user => res.json('New record added!'))
                .catch(err => res.status(400).json('Error' + err));
        }
    });


};

const tokenIsValid =  async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



export default {
    getUsers,
    getUser,
    deleteUser,
    signup,
    getUserBuilds,
    login,
    tokenIsValid
}