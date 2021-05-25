//const router =  require('express').Router();

import express from 'express';
const router = express.Router();

import product from '../controllers/product.controller.js';

//const product = require('../controllers/product.controller');

router.get('/scrape', product.addProduct);
router.get('/:productType', product.getProducts);

//module.exports = router;
export default router;