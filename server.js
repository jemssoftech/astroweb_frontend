import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Attach Socket.IO to the HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Handle Socket.IO connections
  io.on("connection", (socket) => {
    console.log(`[Socket.IO Plugin] Client connected: ${socket.id}`);

    // Example event listener
    socket.on("message", (msg) => {
      console.log(`Message received: ${msg}`);
      // Broadcast to all clients
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO Plugin] Client disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server running`);
    });
});
