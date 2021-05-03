import express from 'express';
const router = express.Router();


import news from '../controllers/news.controller.js';

router.get('/scrape',news.scrapeNews);
router.get('/',news.getArticles);
router.get('/:id',news.getArticle);
router.delete('/clear',news.clearNews);

export default router;