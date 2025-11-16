// Simple in-memory storage for demo (replace with MongoDB if needed)
let texts = [];

export const sendText = (req, res) => {
  const { room, message, sender } = req.body;
  if (!message || !room) return res.status(400).send("Invalid data");

  const newMessage = { room, message, sender, timestamp: new Date() };
  texts.push(newMessage);
  res.status(201).json(newMessage);
};

export const getTexts = (req, res) => {
  const { room } = req.params;
  const roomMessages = texts.filter(t => t.room === room);
  res.json(roomMessages);
};
