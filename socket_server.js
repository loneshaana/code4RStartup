"use strict";
var socketIO = require("socket.io");

var ot = require("ot");
var roomList = {}; // will store the users joined a particular oom

// exporting a function to initialize the socket.io

module.exports = function (server) {
  var str = "Your code editor is ready to use!";
  // takes existing http server as an argument and attaches socket.io
  var io = socketIO(server,{
    pingInterval: 2500, // How often to send a ping (default: 25000 ms)
    pingTimeout: 60000   // Time to wait for a pong before closing the connection (default: 60000 ms)
  });

  io.on("connection", function (socket) {
    console.log("Client connected with socker Id:", socket.id);

    // this event is triggered when a client connects to a server
    // io.on listens for a new connection from the client
    socket.on("joinRoom", function (data) {
      console.log("Client joinded room", data.room);
      if (!roomList[data.room]) {
        var socketIOServer = new ot.EditorSocketIOServer(
          str,
          [],
          data.room,
          async function (socket, cb) {
            /**
           * Everytime some ones opens a new task/existing, find the content of that specific task and update content with the latest one
           */
            var self = this; 
            // update task identified by data.room with the content field set to self.doc 
            var task = await Task.findByIdAndUpdate(data.room, {content:self.document})  // content is equal to content of cod editor
            if(!task) return cb(false)
            cb(true);
          
          }
        );
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);
      socket.room = data.room; //
      socket.join(data.room); // to create a socket based on room , anyone inside the socket can only send the message

      io.to(socket.room).emit("ConnectedUsers", roomList[data.room].users);
    });
    // function to open a socket named chat message
    socket.on("chatMessage", function (data) {
      console.log("Message received", data, "in room", socket.room);
      // listens to the custom event : chatmessage
      //   io.emit("chatMessage", data);
      io.to(socket.room).emit("chatMessage", data);
      // io.emit -->> broadcasts message to all the connected clients
      //   console.log("Message received from server", data);
    });

    socket.on("pong", function (data) {
      console.log("Pong received from client", data);
    });
    
    socket.on("disconnect", function () {
      console.log("client disconnected:");
      socket.leave(socket.room); // Once you leave the room, just disconnect.
    });
  });
};
