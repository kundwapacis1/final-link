// controllers/textController.js
import Text from '../models/textModel.js';

// Send a new text message
export const sendText = async (req, res) => {
  try {
    const { sender, content, room } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const text = await Text.create({ sender, content, room });
    res.status(201).json(text);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all text messages or by room
export const getTexts = async (req, res) => {
  try {
    const { room } = req.query;
    const filter = room ? { room } : {};
    const texts = await Text.find(filter).sort({ createdAt: -1 });
    res.status(200).json(texts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
