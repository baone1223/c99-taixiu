const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ===== STATIC HTML =====
app.use(express.static("public"));

// ===== GAME CONFIG =====
const BET_TIME = 15;
let time = BET_TIME;

// ===== ROUTE TEST =====
app.get("/api/status", (req, res) => {
  res.json({ status: "Tai Xiu server running" });
});

// ===== SOCKET =====
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("countdown", time);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ===== GAME LOOP =====
setInterval(() => {
  time--;
  if (time <= 0) time = BET_TIME;
  io.emit("countdown", time);
}, 1000);

// ===== START SERVER (CHUẨN DEPLOY) =====
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🎲 Server running on port ${PORT}`);
});
