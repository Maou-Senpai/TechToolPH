// let Product = require('../models/product.model');

import Product from '../models/product.model.js';
import request from 'request';
import * as cheerio from 'cheerio';

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
    Product.deleteMany({})
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
};

const addProduct = (req,res) => {
    var options = {
        headers: {'user-agent': 'node.js'}
    }

    for(let i=1; i<3; i++){
            request('https://dynaquestpc.com/collections/processor?page=' + i, options, function(error, response, html){
            if(!error && response.statusCode === 200){
                const $ = cheerio.load(html)
                console.log(html);
                $('.row-container.list-unstyled.clearfix').each((i,el) => {
                    let product = $(el).find('.title-5');
                    product = product.text().replace(/\s\s+/g, "")
                    console.log(product);
                    let price = $(el).find('.price');
                    price = price.text().replace("₱", "").replace(/\s\s+/g, "");
                    let image = $(el).find('img');
                    image = image.attr('src').replace(/\s\s+/g, "");

                    const type = "cpu";
                    const newProduct = new Product({
                        product, price, image, type
                    });

                    newProduct.save()
                        .then(() => res.json('New Product Added!'))
                        .catch(err => res.status(400).json('Error' + err));
                });
            }
        });
    }

    // for(let i=1; i<11; i++) {
    //     request('https://dynaquestpc.com/collections/motherboard?page=' + i, options, function(error, response, html){
    //         if(!error && response.statusCode == 200){
    //             const $ = cheerio.load(html)
    //             $('.row-container.list-unstyled.clearfix').each((i,el) => {
    //                 let product = $(el).find('.title-5');
    //                 product = product.text().replace(/\s\s+/g, "")
    //                 let price = $(el).find('.price');
    //                 price = price.text().replace("₱", "").replace(/\s\s+/g, "");
    //                 let image = $(el).find('img');
    //                 image = image.attr('src').replace(/\s\s+/g, "");
    //
    //                 const type = "motherboard";
    //                 const newProduct = new Product({
    //                     product, price, image, type
    //                 });
    //
    //                 newProduct.save()
    //                     .then(() => res.json('New Product added!'))
    //                     .catch(err => res.status(400).json('Error'+err));
    //             });
    //         }
    //     });
    // }
    //
    // for(let i=1; i<4; i++){
    //     request('https://dynaquestpc.com/collections/graphics-card?page=' + i, options, function(error, response, html){
    //         if(!error && response.statusCode == 200){
    //             const $ = cheerio.load(html)
    //             $('.row-container.list-unstyled.clearfix').each((i,el) => {
    //                 let product = $(el).find('.title-5');
    //                 product = product.text().replace(/\s\s+/g, "")
    //                 let price = $(el).find('.price');
    //                 price = price.text().replace("₱", "").replace(/\s\s+/g, "");
    //                 let image = $(el).find('img');
    //                 image = image.attr('src').replace(/\s\s+/g, "");
    //
    //                 const type = "gpu";
    //                 const newProduct = new Product({
    //                     product, price, image, type
    //                 });
    //
    //                 newProduct.save()
    //                     .then(() => res.json('New Product added!'))
    //                     .catch(err => res.status(400).json('Error'+err));
    //             });
    //         }
    //     });
    // }
    //
    // for(let i=1; i<7; i++){
    //     request('https://dynaquestpc.com/collections/memory?page=' + i, options, function(error, response, html){
    //         if(!error && response.statusCode == 200){
    //             const $ = cheerio.load(html)
    //             $('.row-container.list-unstyled.clearfix').each((i,el) => {
    //                 let product = $(el).find('.title-5');
    //                 product = product.text().replace(/\s\s+/g, "")
    //                 let price = $(el).find('.price');
    //                 price = price.text().replace("₱", "").replace(/\s\s+/g, "");
    //                 let image = $(el).find('img');
    //                 image = image.attr('src').replace(/\s\s+/g, "");
    //
    //                 const type = "ram";
    //                 const newProduct = new Product({
    //                     product, price, image, type
    //                 });
    //
    //                 newProduct.save()
    //                     .then(() => res.json('New Product added!'))
    //                     .catch(err => res.status(400).json('Error'+err));
    //             });
    //         }
    //     });
    // }
    //
    // for(let i=1; i<8; i++){
    //     request('https://dynaquestpc.com/collections/power-supply?page=' + i, options, function(error, response, html){
    //         if(!error && response.statusCode == 200){
    //             const $ = cheerio.load(html)
    //             $('.row-container.list-unstyled.clearfix').each((i,el) => {
    //                 let product = $(el).find('.title-5');
    //                 product = product.text().replace(/\s\s+/g, "")
    //                 let price = $(el).find('.price');
    //                 price = price.text().replace("₱", "").replace(/\s\s+/g, "");
    //                 let image = $(el).find('img');
    //                 image = image.attr('src').replace(/\s\s+/g, "");
    //
    //                 const type = "psu";
    //                 const newProduct = new Product({
    //                     product, price, image, type
    //                 });
    //
    //                 newProduct.save()
    //                     .then(() => res.json('New Product added!'))
    //                     .catch(err => res.status(400).json('Error'+err));
    //             });
    //         }
    //     });
    // }
    //
    // for(let i=1; i<8; i++){
    //     request('https://dynaquestpc.com/collections/hard-drive?page=' + i, options, function(error, response, html){
    //         if(!error && response.statusCode == 200){
    //             const $ = cheerio.load(html)
    //             $('.row-container.list-unstyled.clearfix').each((i,el) => {
    //                 let product = $(el).find('.title-5');
    //                 product = product.text().replace(/\s\s+/g, "")
    //                 let price = $(el).find('.price');
    //                 price = price.text().replace("₱", "").replace(/\s\s+/g, "");
    //                 let image = $(el).find('img');
    //                 image = image.attr('src').replace(/\s\s+/g, "");
    //
    //                 const type = "storage";
    //                 const newProduct = new Product({
    //                     product, price, image, type
    //                 });
    //
    //                 newProduct.save()
    //                     .then(() => res.json('New Product Added!'))
    //                     .catch(err => res.status(400).json('Error'+err));
    //             });
    //         }
    //     });
    // }
};

export default {
    getProducts,
    getProduct,
    deleteProduct,
    addProduct,
}