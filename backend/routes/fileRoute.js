import express from "express";
import { upload, uploadFile, downloadFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/:filename", downloadFile);

export default router;
