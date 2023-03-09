require("dotenv").config();
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 6000;

const socketIo = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"],
  },
});

type User = {
  userId: string;
  socketId: string;
};

let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

socketIo.on("connection", (socket: Socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected - clientID: " + socket.id);

  //take userId and socketId from user
  socket.on("addUserFromClient", (userId) => {
    addUser(userId, socket.id);
    socketIo.emit("getUsersFromSocket", users);
  });

  //send and get message
  socket.on("sendMessageFromClient", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      socketIo.to(user.socketId).emit("getMessageFromSocket", {
        senderId,
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected! - clientID: " + socket.id);
    removeUser(socket.id);
    socketIo.emit("getUsersFromSocket", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
