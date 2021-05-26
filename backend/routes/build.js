//const router =  require('express').Router();

import express from 'express';
const router = express.Router();

import build from '../controllers/build.controller.js';
import Build from '../models/build.model.js';

//const build = require('../controllers/build.controller');

router.get('/',build.getBuilds);
router.get('/:id',build.getBuild);
router.delete('/delete/:id',build.deleteBuild);
router.post('/add',build.addBuild);

router.route('/update/:id').post((req, res)=> {

    Build.findById((req.params.id))
        .then(build => {
            build.build_name = req.body[0];
            build.build = req.body[1];
            build.userId = req.body[2];

            build.save()
                .then(() => res.json('Record was updated!'))
                .catch(err => res.status(400).json('Error :' + err));
        })
        .catch(err => res.status(400).json('Error: '+ err));

});


//module.exports = router;
export default router;