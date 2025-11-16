import express from "express";
import { sendText, getTexts } from "../controllers/textController.js";

const router = express.Router();

router.post("/send", sendText);
router.get("/:room", getTexts);

export default router;
