// models/textModel.js
import mongoose from 'mongoose';

const textSchema = new mongoose.Schema(
  {
    sender: { type: String, default: 'Anonymous' },
    content: { type: String, required: true },
    room: { type: String, default: 'general' },
  },
  { timestamps: true }
);

export default mongoose.model('Text', textSchema);
