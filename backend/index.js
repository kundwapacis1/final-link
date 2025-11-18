import dotenv from "dotenv"; 
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import fileRoutes from "./routes/fileRoute.js";
import textRoutes from "./routes/textRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors({ origin: "*", methods: "GET,POST" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// API Routes
app.use("/api/files", fileRoutes);
app.use("/api/text", textRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// FIX: Root route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Socket.io
io.on("connection", (socket) => {
  socket.on("join-room", (room) => socket.join(room));
  socket.on("chat-message", (data) => io.to(data.room).emit("chat-message", data));
  socket.on("file-shared", (data) => io.to(data.room).emit("file-shared", data));
});
// DEFAULT HOME ROUTE (Fix "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
