//let Product = require('../models/product.model');

import Product from '../models/product.model.js';

const getProducts =  (req,res)=>{
    Product.find()
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getProduct = (req,res)=>{
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error :' + err));
};

const deleteProduct = (req,res)=>{
    Product.findByIdAndDelete(req.params.id)
        .then(product => res.json('Record was deleted'))
        .catch(err => res.status(400).json('Error :'+ err));
};

const addProduct = (req,res)=>{

    //change to scraper

    const item_name = req.body.item_name;
    const price = req.body.price;

    const newProduct = new Product({
        item_name,price
    });

    newProduct.save()
        .then(product => res.json('New Product added!'))
        .catch(err => res.status(400).json('Error'+err));
};

export default {
    getProducts,
    getProduct,
    deleteProduct,
    addProduct,
}
