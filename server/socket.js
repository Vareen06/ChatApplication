const { Server } = require("socket.io");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinChat", ({ senderId, receiverId }) => {
      const roomId = `${senderId}-${receiverId}`;
      socket.join(roomId);
      console.log(`User ${senderId} and ${receiverId} joined room: ${roomId}`);
    });

    socket.on(
      "sendMessage",
      ({ _id,roomId, senderId, receiverId, messageText }) => {
        console.log(`Sending message to room - ${roomId}`);
        

        io.emit('receiveMessage',{ _id,roomId, senderId, receiverId, messageText })
      }
    );
    socket.on('UpdateMessage',(data)=>{
      io.emit('Message-updated',data)
      console.log('messagupdated')
    })
    socket.on('deleteMessage',(data)=>{
      io.emit('Message-deleted',data)
      console.log('messagedeleted')
    })
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket };
