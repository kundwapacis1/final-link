// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import { ioHandlers } from './utils/socketHandler.js';
// import { cleanupOldFiles } from './utils/autoClean.js';

// import fileRoutes from './routes/fileRoute.js';
// import textRoutes from './routes/textRoute.js';

// dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/files', express.static(path.join('public', 'uploads')));
// app.use('/', express.static(path.join('public', 'frontend')));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// app.use('/api/files', fileRoutes);
// app.use('/api/text', textRoutes);

// ioHandlers(io);
// cleanupOldFiles();

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));



import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import fileRoutes from './routes/fileRoute.js';
import textRoutes from './routes/textRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// --- Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// --- Routes
app.use('/api/files', fileRoutes);
app.use('/api/text', textRoutes);
app.get("/", (req, res) => {
  res.send("Backend API is running 🎉");
});


// --- Socket.io for chat & file
io.on('connection', socket => {
  socket.on('join-room', room => socket.join(room));
  socket.on('chat-message', data => io.to(data.room).emit('chat-message', data));
  socket.on('file-shared', data => io.to(data.room).emit('file-shared', data));
});

// --- Start server
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
