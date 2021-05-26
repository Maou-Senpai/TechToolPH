import express from 'express';
const router = express.Router();

import benchmark from '../controllers/benchmarks.controller.js';

router.get('/cpu', benchmark.getCPU);
router.get('/gpu', benchmark.getGPU);
router.get('/scrape', benchmark.scrape);

export default router;