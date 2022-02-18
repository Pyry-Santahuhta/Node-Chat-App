const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let thisChannel = "";
let users = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join channel", (data) => {
    let newUser = addUser(socket.id, data.username, data.channel);
    socket.emit("send data", {
      id: socket.id,
      username: data.username,
      channel: data.channel,
    });
    thisChannel = data.channel;
    socket.join(newUser.channel);
  });

  socket.on("chat message", (msg) => {
    io.to(thisChannel).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnected");
  });
});

function addUser(socketID, userName, channelID) {
  const user = {
    socket: socketID,
    username: userName,
    channel: channelID,
  };
  users.push(user);
  return user;
}

function removeUser(socketID) {
  const user = (users) => users.socket === socketID;
  const index = users.findIndex(user);
  if (index === -1) {
    return users.splice(index, 1)[0];
  }
}

server.listen(3000, () => {
  console.log("listening on port:3000");
});
