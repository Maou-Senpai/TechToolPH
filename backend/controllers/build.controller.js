//let Build = require('../models/build.model');

import Build from '../models/build.model.js';

const getuserBuilds = (req,res)=>{
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
        .then(build => res.json('Record was deleted'))
        .catch(err => res.status(400).json('Error :'+ err));
};

const addBuild = (req,res)=>{
    const build_name = req.body.build_name;
    const processor = req.body.processor;
    const graphics_card = req.body.graphics_card;
    const motherboard = req.body.motherboard;
    const memory = req.body.memory;
    const userId = req.body.userId;

    const newBuild = new Build({
        build_name,processor,graphics_card,motherboard,memory,userId
    });

    newBuild.save()
        .then(build => res.json('New record added!'))
        .catch(err => res.status(400).json('Error'+err));
};

export default {
    getuserBuilds,
    getBuilds,
    getBuild,
    deleteBuild,
    addBuild
}
