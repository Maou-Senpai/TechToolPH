// let Product = require('../models/product.model');

import puppeteer from 'puppeteer';
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

async function scrapeEasyPC(req, res) {
    let pages = {
        cpu: ['https://easypc.com.ph/collections/processor-amd', 'https://easypc.com.ph/collections/processor-intel'],
        gpu: ['https://easypc.com.ph/collections/graphic-card'],
        motherboard: ['https://easypc.com.ph/collections/motherboard'],
        ram: ['https://easypc.com.ph/collections/memory'],
        storage: ['https://easypc.com.ph/collections/hard-disk', 'https://easypc.com.ph/collections/solid-state-drive'],
        psu: ['https://easypc.com.ph/collections/power-supply'],
        case: ['https://easypc.com.ph/collections/pc-case']
    }
    let browser, page;
    const inStock = "?_=pf&pf_st_stock_status=true";
    const pageQuery = "&page="
    browser = await puppeteer.launch({headless: false});

    for (let part in pages) {
        for (let pageHTML of pages[part]) {
            page = await browser.newPage();
            await page.goto(pageHTML + inStock);

            let pageN = await page.$eval('#bc-sf-filter-bottom-pagination', val => {
                const pageButtons = val.querySelectorAll('li');
                if (pageButtons.length === 0) return 1;
                return pageButtons[pageButtons.length - 2].textContent;
            });

            for (let i = 1; i <= pageN; i++) {
                console.log(pageHTML + inStock + pageQuery + i);
                if (i > 1) await page.goto(pageHTML + inStock + pageQuery + i);
                await easyPC(page, part);
            }
        }
    }

    await browser.close();

    if (res != null) res.json("Done");
}

async function easyPC(page, type) {
    const products = await page.$$eval('.bc-sf-filter-product-item-inner', (val, type) => {
        const baseURL = 'https://easypc.com.ph';
        const rtn = [];
        val.forEach(part => {
            let item_name = part.querySelector('.bc-sf-filter-product-item-title').textContent.toUpperCase();
            let price = part.querySelector('.hidePrice').textContent.replaceAll("₱", "");
            let image = part.querySelector('img').srcset;
            image = image.slice(image.lastIndexOf("http"));
            image = image.slice(0, image.lastIndexOf(" "));
            let url = baseURL + part.querySelector('.bc-sf-filter-product-item-title').getAttribute("href");
            let source = "EasyPC";
            rtn.push([item_name, price, image, type, url, source]);
        })
        return rtn;
    }, type);

    // noinspection JSUnresolvedVariable
    for (let i = 0; i < products.length; i++) {
        const val = products[i];
        await scrapedData(val[0], val[1], val[2], val[3], val[4], val[5]);
    }
}

async function scrapedData(item_name, price, image, type, link, source) {
    const newProduct = new Product({
        item_name, price, image, type, link, source
    });

    newProduct.save()
        .then(() => console.log("Added " + item_name))
        .catch((e) => console.log(e));
}

const addProduct = async (req, res) => {
    Product.deleteMany({})
        .then(() => console.log("Collection Cleared"))
        .catch(() => console.log("Collection Failed to Clear"));

    Promise.all([scrapeDynaQuest(), scrapeVillman(), scrapeEasyPC()])
        .then(() => res.json("Done"))
        .catch(() => res.json("Error"));

    return res;
}

export default {
    getProducts,
    scrapeDynaQuest,
    scrapeVillman,
    scrapeEasyPC,
    addProduct
}