import News from '../models/news.model.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const getArticles =  (req,res)=>{
    News.find().sort({"time": "desc"})
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
    return res;
};

const getArticle =  (req,res)=>{
    News.findById(req.params.id)
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
    return res;
};

async function scrapedData(title, author, link, time, thumbnail, source) {
    await News.deleteOne({"title": title})
        .then(() => console.log("Deleted " + title))
        .catch((e) => console.log(e));

    const newArticle = new News({
        title, author, link, time, thumbnail, source
    })

    newArticle.save()
        .then(() => console.log("Added " + title))
        .catch((e) => console.log(e));
}

const scrapePCGamer = async (req, res) => {
    const maxArticle = 150;
    let articleCount = 0;
    let url = 'https://www.pcgamer.com/news/';

    while (articleCount < maxArticle) {
        const response = await fetch(url);
        const body = await response.text();
        const $ = await cheerio.load(body);

        $('.listingResult.small').each((i, elem) => {
            if (i > 0) {
                const title = $(elem).find('h3.article-name').text();
                const author = $(elem).find('span.by-author').children().text().trim();
                const link = $(elem).find('a.article-link').attr('href');
                const time = $(elem).find('time.published-date.relative-date').attr('datetime');
                const thumbnail = $(elem).find('div.image-remove-reflow-container.landscape').attr('data-original');
                const source = "PCGamer";

                scrapedData(title, author, link, time, thumbnail, source);
                articleCount++;

                if (articleCount < maxArticle) url = $('link[rel=next]').attr('href');
                else return false;
            }
        })

        console.log(articleCount);
    }

    if (res != null) return res.json('Done');
}

const scrapeYugatech = async (req, res) => {
    const baseURL = "https://www.yugatech.com";
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(baseURL);

    let data = await page.$$eval("article.group.post-standard", elements => {
        const rtn = [];
        elements.forEach(value => {
            const title = value.querySelector("p.tab-item-title").querySelector("a").getAttribute("title");
            const author = value.querySelector("p.post-byline").querySelector("a").innerHTML;
            const link = value.querySelector("p.tab-item-title").querySelector("a").getAttribute("href");
            let time = value.querySelector("p.post-byline").textContent;
            time = new Date(time.slice(time.indexOf(" · ") + 3)).toISOString();
            let thumbnail = value.querySelector("div.tab-item-thumbnail").querySelector("img").getAttribute("src");
            thumbnail = thumbnail.slice(0, thumbnail.indexOf("?"));
            const source = "Yugatech";

            rtn.push([title, author, link, time, thumbnail, source]);
        })
        return rtn;
    });

    await data.forEach(val => {
        scrapedData(val[0], val[1], val[2], val[3], val[4], val[5]);
    })

    await browser.close();

    if (res != null) return res.json('Done');
}

const scrapeGameDebate = async (req, res) => {
    const baseURL = "https://game-debate.com";
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    let articleCount = 0, pageN = 0;
    while (articleCount < 30) {
        await page.goto(baseURL + "/news/index.php?page=" + ++pageN);

        let data = await page.$$eval("div.pad10", (elements, baseURL) => {
            let rtn = [];
            elements.forEach(value => {
                const title = value.querySelector("div.newsblogImgTitle").querySelector("a").textContent.trim();
                const author = value.querySelector("div.newsblogImgTitle").querySelector("a").getAttribute("href");
                const link = baseURL + value.querySelector("img.news-headline-img").getAttribute("src");
                let time = value.querySelector("span.news-front-date").textContent.replace("on ", "").replace("at ", "");
                time = new Date(time).toISOString();
                let thumbnail = baseURL + value.querySelector("img.news-headline-img").getAttribute("src");
                const source = "Game Debate";

                rtn.push([title, author, link, time, thumbnail, source])
            })
            return rtn;
        }, baseURL);

        data.forEach(value => {
            scrapedData(value[0], value[1], value[2], value[3], value[4], value[5]);
            articleCount++;
        });
    }

    await browser.close();

    if (res != null) return res.json('Done');
}

const scrapeNews = async (req, res) => {
    await Promise.all([scrapePCGamer(), scrapeYugatech(), scrapeGameDebate()])
        .then(() => res.json("Done"))
        .catch((e) => res.json(e.toString()));
    return res;
};

const clear = async (req, res) => {
    await News.deleteMany({})
        .then(() => res.json("Done"))
        .catch((e) => res.json(e));
    return res;
};

export default {
    scrapePCGamer,
    scrapeYugatech,
    scrapeGameDebate,
    scrapeNews,
    getArticles,
    getArticle,
    clear
}