import express from "express";
import http from "http";
import { Server } from "socket.io";
// import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8000"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("✅ New Client Connected:", socket.id);

  const receiverId = socket.handshake.query.receiverId;

  if (receiverId) {
    userSocketMap[receiverId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 💬 Handle message sending with optional delay
  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message, sendAt } = data;

    const msg = {
      senderId,
      receiverId,
      message,
      timestamp: sendAt ? new Date(sendAt) : new Date(),
    };

    console.log("🕒 Message scheduled:", msg);

    const delay = sendAt ? new Date(sendAt).getTime() - Date.now() : 0;

    if (delay <= 0) {
      // send immediately
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", msg);
      }
    } else {
      // schedule delivery
      setTimeout(() => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", msg);
        }
      }, delay);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
    delete userSocketMap[receiverId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});

export { app, server, io };
