//const router =  require('express').Router();

import express from 'express';
const router = express.Router();

import build from '../controllers/build.controller.js';

//const build = require('../controllers/build.controller');

router.get('/',build.getBuilds);
router.get('/:id',build.getBuild);
router.delete('/delete/:id',build.deleteBuild);
router.post('/add',build.addBuild);

//module.exports = router;
export default router;