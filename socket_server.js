"use strict";
var socketIO = require("socket.io");
// exporting a function to initialize the socket.io
module.exports = function (server) {
  // takes existing http server as an argument and attaches socket.io
  var io = socketIO(server);

  io.on("connection", function (socket) {     // this event is triggered when a client connects to a server
    // io.on listens for a new connection from the client

    // function to open a socket named chat message
    socket.on("chatMessage", function (data) { // listens to the custom event : chatmessage
      io.emit("chatMessage", data); 
      // io.emit -->> broadcasts message to all the connected clients
    });
  });
};
