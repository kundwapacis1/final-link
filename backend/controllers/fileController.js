// controllers/fileController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --- Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join('public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp + original name
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

// --- File filter
const fileFilter = (req, file, cb) => {
  // Allowed MIME types (images, pdf, txt, docs)
  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 
    'application/pdf', 'text/plain', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// --- Multer upload instance
export const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter
});

// --- Upload controller
export const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid type' });

  const fileMeta = {
    originalName: req.file.originalname,
    url: `/files/${req.file.filename}`,
    size: req.file.size
  };

  return res.status(201).json(fileMeta);
};

// LIST FILES
export const listFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files', error });
    }
};
