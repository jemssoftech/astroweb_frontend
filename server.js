import { createServer } from "node:http";
import next from "next";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

// Load environment variables from .env.local
const { combinedEnv } = loadEnvConfig(process.cwd());
const AUTH_BASE_URL = process.env.AUTH_BASE_URL || combinedEnv.AUTH_BASE_URL;

console.log(`[Server] AUTH_BASE_URL: ${AUTH_BASE_URL}`);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
