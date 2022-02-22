const form = document.getElementById("form");
const socket = io();
const input = document.getElementById("input");
const channelInfo = document.getElementById("channel-info");
let username = "";
let channel = prompt("Give the channel name you wish to join");
let id = "";

socket.on("send data", (data) => {
  id = data.id;
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    if (username === "") {
      username = input.value;
      input.placeholder = "Write a message as " + username;
      channelInfo.innerHTML = "You are in channel " + channel;

      socket.emit("join channel", { username: username, channel: channel });
    } else {
      const message = {
        text: input.value,
        name: username,
        id: id,
      };
      socket.emit("chat message", message);
    }

    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const newMessage = document.createElement("li");

  //Get current time, add leading 0's to time's so they look nice.
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
  if (msg.id === id) {
    newMessage.className = "ownMessage";
  } else {
    newMessage.className = "receivedMessage";
  }
  newMessage.innerHTML = msg.name + ": " + msg.text + "<br />" + current;
  messages.appendChild(newMessage);
  window.scrollTo(0, document.body.scrollHeight);
});
