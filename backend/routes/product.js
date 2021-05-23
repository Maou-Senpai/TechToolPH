//const router =  require('express').Router();

import express from 'express';
const router = express.Router();

import product from '../controllers/product.controller.js';

//const product = require('../controllers/product.controller');


router.get('/', product.getProducts);
router.get('/:id',product.getProduct);
router.delete('/delete/:id',product.deleteProduct)
router.post('/add',product.addProduct);

//module.exports = router;
export default router;