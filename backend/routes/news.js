import express from 'express';
const router = express.Router();

import news from '../controllers/news.controller.js';

router.get('/', news.getArticles);
router.get('/scrape', news.scrapeNews);
router.get('/scrape/PCGamer', news.scrapePCGamer);
router.get('/scrape/Yugatech', news.scrapeYugatech);
router.get('/scrape/GameDebate', news.scrapeGameDebate);
router.get('/clear', news.clear);
router.get('/:id', news.getArticle);

export default router;