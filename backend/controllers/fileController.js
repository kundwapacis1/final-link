import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

const conn = mongoose.connection;
let gfsBucket;

conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("GridFSBucket initialized");
});

// Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const readableFile = new Readable();
  readableFile.push(req.file.buffer);
  readableFile.push(null);

  const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
  });

  readableFile.pipe(uploadStream)
    .on("error", (err) => res.status(500).send(err.message))
    .on("finish", () => res.status(201).json({ 
        fileId: uploadStream.id, 
        filename: req.file.originalname 
    }));
};

export const downloadFile = (req, res) => {
  const { filename } = req.params;

  gfsBucket.find({ filename }).toArray((err, files) => {
    if (!files || files.length === 0) return res.status(404).send("File not found");

    const downloadStream = gfsBucket.openDownloadStreamByName(filename);
    res.set({
      "Content-Type": files[0].contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    downloadStream.pipe(res);
  });
};
