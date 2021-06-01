//let Build = require('../models/build.model');

import Build from '../models/build.model.js';

const getUserBuilds = (req, res)=>{
    Build.find({userId: req.params.id})
        .sort({updatedAt: -1})
        .then(builds => res.json(builds))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getBuilds = (req,res)=>{
    Build.find()
        .then(build => res.json(build))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getBuild = (req,res)=>{
    Build.findById(req.params.id)
        .then(build => res.json(build))
        .catch(err => res.status(400).json('Error :' + err));
};

const deleteBuild = (req,res)=>{
    Build.findByIdAndDelete(req.params.id)
        .then(() => res.json('Record was deleted'))
        .catch(err => res.status(400).json('Error :'+ err));
};

const addBuild = (req, res) => {
    const build_name = req.body[0];
    const build = req.body[1];
    const userId = req.body[2];
    console.log(build_name);

    const newBuild = new Build({
        build_name, build,userId
    });

    newBuild.save()
        .then((result) => {
            res.json(result);
            console.log("Added Build");
        })
        .catch((e) => {
            console.log(e);
            res.status(500);
        });

    return res;
};

export default {
    getUserBuilds,
    getBuilds,
    getBuild,
    deleteBuild,
    addBuild
}
