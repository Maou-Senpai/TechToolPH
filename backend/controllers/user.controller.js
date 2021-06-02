//let User = require('../models/user.model');
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from "jsonwebtoken";
import Build from '../models/build.model.js';

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
    Build.deleteMany({userId: req.params.id})
        .then(builds=>{res.json('User builds deleted'); console.log("nice")})
        .catch(err=>res.status(400).json('Eroror :'+ err));

    User.findByIdAndDelete(req.params.id)
        .then(user => {res.json('User was deleted'); console.log("woop")})
        .catch(err => res.status(400).json('Error :'+ err));
};


const getUserBuilds = (req,res)=>{
    Build.find({userId: req.params.id})
        .sort({updatedAt: -1})
        .then(builds => res.json(builds))
        .catch(err => res.status(400).json('Error :'+ err));
};


const update = async(req,res)=>{
    console.log("i went here")

    let { username, password, passwordCheck } = req.body;

    let pass = false;
    if(!password && !passwordCheck){
        pass = true;
    }

    console.log(!pass)

    if (!pass) {
        if(!password || !passwordCheck) {
            console.log("fail3")
            return res.status(400).json({msg: "Not all fields have been entered."});
        }
    }

    if(password && passwordCheck) {
        if (password.length < 5) {
            console.log("fail")
            return res
                .status(400)
                .json({msg: "The password needs to be at least 5 characters long."});
        }
        if (password !== passwordCheck) {
            console.log("fail1")
            return res
                .status(400)
                .json({msg: "Enter the same password twice for verification."});
        }
    }


    User.findById((req.params.id))
        .then(user => {

            user.username = username
            if(pass !== true){
                user.password = user.generateHash(password)
            }

            user.save()
                .then(() => res.json('Record was updated!'))
                .catch(err => res.status(400).json('Error :' + err));
        })
        .catch(err => res.status(400).json('Error: '+ err));
}

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
                id: user._id,
                username: user.username
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const signup = async(req,res)=>{
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
    console.log(username)

    const existing = await User.findOne({username: username});
    if(existing){
        console.log(existing)
        return res
            .status(500)
            .json({msg: "Account already exists."})
    }

    const newUser = new User();
    newUser.username = username;
    newUser.password = newUser.generateHash(password);

    newUser.save()
        .then(user => res.json('New record added!'))
        .catch(err => res.status(400).json('Error' + err));
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
    tokenIsValid,
    update
}