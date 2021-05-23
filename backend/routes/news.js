import express from 'express';
const router = express.Router();

import news from '../controllers/news.controller.js';

router.get('/', news.getArticles);
router.get('/scrape', news.scrapeNews);
router.get('/clear', news.clearNews);
router.get('/:id', news.getArticle);

export default router;