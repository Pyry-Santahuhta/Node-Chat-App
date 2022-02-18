console.log("loaded boyo");
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
  const now = new Date();
  const current = now.getHours() + ":" + now.getMinutes();
  if (msg.id === id) {
    newMessage.className = "ownMessage";
  }
  newMessage.textContent = current + " " + msg.name + ": " + msg.text;
  messages.appendChild(newMessage);
  window.scrollTo(0, document.body.scrollHeight);
});
