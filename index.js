const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

//Serve client side as a static folder
app.use(express.static(path.join(__dirname, "public")));

//Respond with index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//Used for emitting to only clients with the same channel
let thisChannel = "";
//Storing users
let users = [];

//On TCP connection
io.on("connection", (socket) => {
  console.log("a user connected");
  //Join channel happens when a user sets their username
  socket.on("join channel", (data) => {
    //Add a new user
    let newUser = addUser(socket.id, data.username, data.channel);

    //Send the user their id
    socket.emit("send id", {
      id: socket.id,
    });
    thisChannel = newUser.channel;
    socket.join(newUser.channel);
  });

  //Emit chat message to all users in the channel
  socket.on("chat message", (msg) => {
    io.to(thisChannel).emit("chat message", msg);
  });

  //Remove user when disconnected
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnected");
  });
});

//Function for adding user to the user list
function addUser(socketID, userName, channelID) {
  const user = {
    socket: socketID,
    username: userName,
    channel: channelID,
  };
  users.push(user);
  return user;
}

//Function for removing users from the user list
function removeUser(socketID) {
  const user = (users) => users.socket === socketID;
  const index = users.findIndex(user);
  if (index === -1) {
    return users.splice(index, 1)[0];
  }
}

//Start the server
server.listen(3000, () => {
  console.log("listening on port:3000");
});
