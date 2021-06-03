// let Product = require('../models/product.model');

import Product from '../models/product.model.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const getProducts = (req, res) => {
    Product.find({"type": {$regex: req.params["productType"]}})
        .then(product => res.json(product))
        .catch(() => res.json('Cannot Find Products'));
    return res;
};

async function scrapeDynaQuest(req, res) {
    if (res != null) {
        Product.deleteMany({ source: "DynaQuestPC" })
            .then(() => console.log("Collection Cleared"))
            .catch(() => console.log("Collection Failed to Clear"));
    }

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

                scrapedData(item_name, price, image, type, link, source);
            });
        } while ($('link[rel=next]').length > 0);
    }

    if (res != null) res.json("Done");
}

async function scrapeVillman(req, res) {
    if (res != null) {
        Product.deleteMany({ source: "Villman" })
            .then(() => console.log("Collection Cleared"))
            .catch(() => console.log("Collection Failed to Clear"));
    }

    let pages = {
        cpu: 'https://villman.com/Category/Processors',
        gpu: 'https://villman.com/Category/GPU',
        motherboard: 'https://villman.com/Category/Motherboards',
        ram: 'https://villman.com/Category/Desktop-RAM',
        storage: 'https://villman.com/Category/HDDs-Desktop-PCs',
        psu: 'https://villman.com/Category/Power-Supplies',
        case: 'https://villman.com/Category/PC-Case'
    }
    let response, body, $;
    const baseURL = 'https://villman.com';

    for (const value of Object.entries(pages)) {
        response = await fetch(value[1]).then(res => res);
        body = await response.text();
        $ = await cheerio.load(body);

        let pageN = $('.paging_num').length;
        if (pageN > 0) pageN--;
        for (let i = 0; i <= pageN; i++) {
            console.log(value[1] + "/" + i * 50);
            response = await fetch(value[1] + "/" + i * 50).then(res => res);
            body = await response.text();
            $ = await cheerio.load(body);
            await villman($, baseURL, value);
        }
    }

    if (res != null) res.json("Done");
}

async function villman($, baseURL, value) {
    // noinspection JSUnresolvedFunction
    $('.prod_link').each((i, el) => {
        // noinspection JSUnresolvedFunction
        const link = $(el).attr('href');
        const url = 'https://villman.com' + link;

        fetch(url).then(async res => {
            const prodBody = await res.text();
            const $2 = await cheerio.load(prodBody);

            // noinspection JSUnresolvedFunction
            $2('.contents').each((i2, el2) => {
                const item_name = $(el2).find('h1').text().trim();
                const price = $(el2).find('.prod2_price').text().replace("Price:", "").trim();
                // noinspection JSUnresolvedFunction
                const image = baseURL + $(el2).find('img').attr('src');
                const type = value[0];
                const source = "Villman"

                scrapedData(item_name, price, image, type, url, source);
            })
        });
    });
}

const addProduct = async (req, res) => {
    Product.deleteMany({})
        .then(() => console.log("Collection Cleared"))
        .catch(() => console.log("Collection Failed to Clear"));

    Promise.all([scrapeDynaQuest(), scrapeVillman()])
        .then(() => res.json("Done"))
        .catch(() => res.json("Error"));

    return res;
}

async function scrapedData(item_name, price, image, type, link, source) {
    const newProduct = new Product({
        item_name, price, image, type, link, source
    });

    newProduct.save()
        .then(() => console.log("Added " + item_name))
        .catch((e) => console.log(e));
}

export default {
    getProducts,
    scrapeDynaQuest,
    scrapeVillman,
    addProduct
}