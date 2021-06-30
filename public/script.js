const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
myVideo.muted = true;
showChat.addEventListener("click", function () {
  document.querySelector(".main__right").classList.toggle("right");
  document.querySelector(".main__left").classList.toggle("fullDisplay");
});

const user = prompt("Enter your name");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});


let myVideoStream;
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
})
  .then(function (stream) {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

const addVideoStream = function (video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", function () {
    video.play();
    videoGrid.append(video);
  });
};


peer.on("call", function (call) {
  call.answer(stream);
  const video = document.createElement("video");
  call.on("stream", function (userVideoStream) {
    addVideoStream(video, userVideoStream);
  });

  socket.on("user-connected", function (userId) {
    connectToNewUser(userId, stream);
  });
});

const connectToNewUser = function (userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", function (userVideoStream) {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", function (id) {
  socket.emit("join-room", ROOM_ID, id, user);
});

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click",function(e){
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown",function(e){
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});


// buttons
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
const inviteButton = document.querySelector("#inviteButton");
muteButton.addEventListener("click", function () {
  const clicked = myVideoStream.getAudioTracks()[0].enabled;
  if (clicked) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteButton.classList.toggle("color");
    muteButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteButton.classList.toggle("color");
    muteButton.innerHTML = '<i class="fas fa-microphone"></i>';
  }
});
stopVideo.addEventListener("click", function () {
  const clicked = myVideoStream.getVideoTracks()[0].enabled;
  if (clicked) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    stopVideo.classList.toggle("color");
    stopVideo.innerHTML = '<i class="fas fa-video-slash"></i>';

  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    stopVideo.classList.toggle("color");
    stopVideo.innerHTML = '<i class="fas fa-video"></i>';

  }
});
inviteButton.addEventListener("click", function (e) {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});
const stopButton = document.querySelector("#stopButton").addEventListener("click" , function () {
  var ans = confirm("Are you sure you want to quit?");
  if (ans == true) {
    window.close();
  }
});


// socket.on("createMessage", function (message, userName) {
//   messages.innerHTML = messages.innerHTML +
//     <div class="message">
//       <b><i class="far fa-user-circle"></i> <span> ${
//         userName === user ? "me" : userName
//       }</span> </b>
//       <span>${message}</span>
//     </div>;
// });
