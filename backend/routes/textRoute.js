// routes/textRoutes.js
import express from 'express';
import { sendText, getTexts } from '../controllers/textController.js';

const router = express.Router();

router.post('/send', sendText);
router.get('/list', getTexts);

export default router;
