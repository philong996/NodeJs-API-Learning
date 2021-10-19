let io;

module.exports = {
  init: (httpServer) => {
    if (!httpServer) {
      throw new Error("No server is initialized");
    }
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("No io is initialized");
    }
    return io;
  },
};
