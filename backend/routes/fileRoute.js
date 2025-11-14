// routes/fileRoute.js
import express from 'express';
import upload from '../middleware/upload.js';
import { uploadFile, listFiles } from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/list', listFiles);

export default router;
