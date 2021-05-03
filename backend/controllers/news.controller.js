import News from '../models/news.model.js';
import request from 'request';
import cheerio from 'cheerio';


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

const clearNews =  (req,res)=>{
    News.remove({})
        .then(news => res.json(news))
        .catch(err => res.status(400).json('Error :'+ err));
};


const scrapeNews = (req,res)=>{
    request('https://www.pcgamer.com/news/',(error, response, html)=>{
        const maxArticle = 50;
        let articleCount = 0;
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html)

            $('.listingResult.small').each((i, elem) => {
                if (i > 0) {
                    const title = $(elem).find('h3.article-name').text();
                    const author = $(elem).find('span.by-author').children().text().trim();
                    const link = $(elem).find('a.article-link').attr('href');
                    const newArticle = new News({
                        title,author,link
                    })
                    newArticle.save()
                        .then(article => res.json('Articles added!'))
                        .catch(err => res.status(400).json('Error'+err));

                    if (articleCount >= maxArticle) return false
                }
            })
        }
    })
};

export default {
    scrapeNews,
    getArticles,
    getArticle,
    clearNews
}
