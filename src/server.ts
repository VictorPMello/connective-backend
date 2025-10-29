import { buildApp } from "./app";
import { env } from "./config/env";

const signals = ["SIGINT", "SIGTERM"];

async function start() {
  try {
    const app = await buildApp();

    signals.forEach((signal) => {
      process.on(signal, async () => {
        try {
          await app.close();
          console.log("Server closed successfully");
          process.exit(0);
        } catch (err) {
          console.error("Error closing server:", err);
          process.exit(1);
        }
      });
    });

    await app.listen({ port: env.PORT || 3333, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${env.PORT || 3333}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();
