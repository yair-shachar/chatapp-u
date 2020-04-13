
var express = require("express");
var http = require("http");

var app = express();
var server = http.Server(app); 
var io = require("socket.io")(server); 
var users = [];

server.listen(3333, function() { 
    console.log("The development server is running at port 3333.");
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/css/index.css", function(req, res) {
    res.sendFile(__dirname + "/css/index.css");
});

io.on("connection", function(socket) {
    var name = "";

    socket.on("has connected", function(username) {
        name = username;
        users.push(username); 
        io.emit("has connected", {username: username, usersList: users});
    });

    socket.on("disconnect", function() {
        users.splice(users.indexOf(name), 1);
        io.emit("has disconnectied", {username: name, usersList: users});
    });

    socket.on("new message", function(data){
        io.emit("new message", data);
    });
});