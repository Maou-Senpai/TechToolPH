import News from '../models/news.model.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const getArticles =  (req,res)=>{
    News.find()
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
};

const getArticle =  (req,res)=>{
    News.findById(req.params.id)
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
};

const scrapeNews = async (req, res) => {
    // Clear Database
    News.deleteMany({})
        .then(() => console.log("Collection Cleared"))
        .catch(() => console.log("Collection Failed to Clear"));

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
                const newArticle = new News({
                    title, author, link, time, thumbnail
                })
                newArticle.save()
                    .then(() => console.log("Added " + title))
                    .catch(() => console.log("Could not Add " + title));
                articleCount++;

                if (articleCount < maxArticle) url = $('link[rel=next]').attr('href');
                else return false;
            }
        })

        console.log(articleCount);
    }

    return res.json('Done');
};

export default {
    scrapeNews,
    getArticles,
    getArticle,
}