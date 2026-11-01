import http from "http";
import { createApp } from "./app.js";
import { logger } from "./pkg/logger/logger.js";
import mongoose from "mongoose";

const app = createApp();
const server = http.createServer(app);

server.listen(3000, () => logger.info("server is running on port 3000"));

async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
