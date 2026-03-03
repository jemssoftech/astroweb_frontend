import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { io as ioClient } from "socket.io-client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
const BACKEND_URL = process.env.AUTH_BASE_URL || "http://localhost:3000";

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

  // ─── Events to proxy: frontend ↔ backend ──────────────────────────────────
  const PROXY_EVENTS = [
    { emit: "get-profile", response: "get-profile-response" },
    { emit: "edit-profile", response: "edit-profile-response" },
    { emit: "refresh-api-key", response: "refresh-api-key-response" },
    { emit: "get-api-usage", response: "get-api-usage-response" },
  ];

  // Handle Socket.IO connections from frontend clients
  io.on("connection", (socket) => {
    console.log(`[Socket.IO Plugin] Client connected: ${socket.id}`);

    let backendSocket = null;

    // Create an authenticated backend socket for this client
    function getOrCreateBackendSocket(token) {
      if (backendSocket && backendSocket.connected) return backendSocket;

      // Disconnect old socket if it exists
      if (backendSocket) backendSocket.disconnect();

      backendSocket = ioClient(BACKEND_URL, {
        auth: { token, accessToken: token },
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      backendSocket.on("connect", () => {
        console.log(`[Backend Socket] ${socket.id} → backend connected`);
      });
      backendSocket.on("connect_error", (err) => {
        console.error(
          `[Backend Socket] ${socket.id} connection error:`,
          err.message,
        );
      });

      // Set up response listeners: backend → frontend
      PROXY_EVENTS.forEach(({ response: responseEvent }) => {
        backendSocket.on(responseEvent, (data) => {
          console.log(`[Proxy] backend → ${socket.id}: ${responseEvent}`);
          socket.emit(responseEvent, data);
        });
      });

      return backendSocket;
    }

    // Set up event forwarding: frontend → backend
    PROXY_EVENTS.forEach(({ emit: emitEvent }) => {
      socket.on(emitEvent, (payload) => {
        const token = payload?.token || payload?.accessToken;
        if (!token) {
          console.error(`[Proxy] No token in ${emitEvent} from ${socket.id}`);
          return;
        }

        const bs = getOrCreateBackendSocket(token);
        console.log(`[Proxy] ${socket.id} → backend: ${emitEvent}`);
        bs.emit(emitEvent, payload);
      });
    });

    // Generic message event
    socket.on("message", (msg) => {
      console.log(`Message received: ${msg}`);
      io.emit("message", msg);
    });

    // Clean up per-client backend socket on disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket.IO Plugin] Client disconnected: ${socket.id}`);
      if (backendSocket) {
        backendSocket.disconnect();
        backendSocket = null;
      }
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
