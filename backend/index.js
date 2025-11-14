import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { ioHandlers } from './utils/socketHandler.js';
import { cleanupOldFiles } from './utils/autoClean.js';

import fileRoutes from './routes/fileRoute.js';
import textRoutes from './routes/textRoute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.join('public', 'uploads')));
app.use('/', express.static(path.join('public', 'frontend')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/files', fileRoutes);
app.use('/api/text', textRoutes);

ioHandlers(io);
cleanupOldFiles();

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
