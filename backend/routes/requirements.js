import express from 'express';
const router = express.Router();

import requirements from '../controllers/requirements.controller.js';

router.get('/search/:id', requirements.search);

export default router;