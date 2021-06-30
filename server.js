// jshint esversion:6
const express=require("express")
const app=express();
const server = require("http").Server(app);
const { v4: uuidv4 }=require("uuid");
app.set("view engine","ejs");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
debug: true,
});
app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.get("/",function(req,res)
{
  res.redirect(`/${uuidv4()}`);

});
app.get("/:room",function(req,res)
{
  res.render("room",{roomId:req.params.room});
});

io.on("connection",function(socket){
socket.on("join-room",function(roomId, userId){
socket.join(roomId);
socket.to(roomId).broadcast.emit("user-connected", userId);
});
});
server.listen(3000,function()
{
  console.log("Server started on port 3000");
});
