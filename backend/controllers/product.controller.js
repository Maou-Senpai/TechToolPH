// let Product = require('../models/product.model');

import Product from '../models/product.model.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const getProducts =  (req, res) => {
    Product.find({"type": {$regex: req.params["productType"]}})
        .then(product => res.json(product))
        .catch(() => res.json('Cannot Find Products'));
    return res;
};

async function scrapeDynaQuest() {
    Product.deleteMany({})
        .then(() => console.log("Collection Cleared"))
        .catch(() => console.log("Collection Failed to Clear"));

    let pages = {
        cpu: 'https://dynaquestpc.com/collections/processor?page=',
        gpu: 'https://dynaquestpc.com/collections/graphics-card?page=',
        motherboard: 'https://dynaquestpc.com/collections/motherboard?page=',
        ram: 'https://dynaquestpc.com/collections/memory?page=',
        storage: 'https://dynaquestpc.com/collections/hard-drive?page=',
        psu: 'https://dynaquestpc.com/collections/power-supply?page=',
        case: 'https://dynaquestpc.com/collections/chassis?page='
    }
    let response, body, $;
    const baseURL = 'https://dynaquestpc.com';

    for (const value of Object.entries(pages)) {
        let i = 0;
        do {
            response = await fetch(value[1] + ++i).then(res => res);
            body = await response.text();
            $ = await cheerio.load(body);

            $('div.row-container.list-unstyled.clearfix').each((i, el) => {
                const item_name = $(el).find('.title-5').text();
                const price = $(el).find('.price').text().replace("₱", "");
                const image = $(el).find('img')[0].attribs.src;
                const link = baseURL + $(el).find('.title-5')[0].attribs.href;
                const type = value[0];
                const source = "DynaQuestPC";

                const newProduct = new Product({
                    item_name, price, image, type, link, source
                });

                newProduct.save()
                    .then(() => console.log("Added: " + item_name))
                    .catch(() => console.log("Not Added: " + item_name));
            });
        } while ($('link[rel=next]').length > 0);
    }
}

const addProduct = (req, res) => {
    Promise.all([scrapeDynaQuest()])
        .then(() => res.json("Done").send)
        .catch(() => res.json("Error"));
    return res;
};

export default {
    getProducts,
    addProduct,
}