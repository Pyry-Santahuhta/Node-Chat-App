const form = document.getElementById("form");
const socket = io();
const input = document.getElementById("input");
const channelInfo = document.getElementById("channel-info");
let username = "";
//On load ask for the channel the user wants to join
let channel = prompt("Give the channel name you wish to join");
let id = "";

//Get the user id back on joining channel
socket.on("send id", (data) => {
  id = data.id;
});

//Listener for the text bar
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    //If there is no username, set the username
    if (username === "") {
      //Default channel in case of user canceling the prompt
      if (channel === null) {
        channel = 1;
      }

      username = input.value;
      //Change the input prompt and channel info
      input.placeholder = "Write a message as " + username;
      channelInfo.innerHTML = "You are in channel " + channel;

      //Send join channel info to server
      socket.emit("join channel", { username: username, channel: channel });
    } else {
      //The user already has a username, so just send a message
      const message = {
        text: input.value,
        name: username,
        id: id,
      };
      //Emit the message
      socket.emit("chat message", message);
    }
    //Empty the input bar
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const newMessage = document.createElement("li");

  //Get current time, add leading 0's to times so they look nice.
  const now = new Date();
  let HH = now.getHours();
  let MM = now.getMinutes();
  if (HH < 10) {
    HH = "0" + HH;
  }
  if (MM < 10) {
    MM = "0" + MM;
  }
  const current = HH + ":" + MM;

  //If the message's id is the user's own, use the ownMessage CSS, otherwise use receivedMessage
  if (msg.id === id) {
    newMessage.className = "ownMessage";
  } else {
    newMessage.className = "receivedMessage";
  }
  //Set the text for a new message
  newMessage.innerHTML = msg.name + ": " + msg.text + "<br />" + current;
  messages.appendChild(newMessage);
  window.scrollTo(0, document.body.scrollHeight);
});
