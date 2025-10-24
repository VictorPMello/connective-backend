import { fastify } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastifyMultipart } from "@fastify/multipart";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./config/env.ts";

import { errorHandler } from "./middlewares/errorHandler.ts";

import { accountRoutes } from "./modules/account/routes.ts";
import { taskRoutes } from "./modules/tasks/routes.ts";
import { projectRoutes } from "./modules/projects/routes.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});

app.register(fastifyCors, { origin: env.CORS_ORIGIN, credentials: true });
app.register(fastifyRateLimit, { max: 100, timeWindow: "15 minutes" });
app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

// Accout Routes
app.register(accountRoutes);
// Task Routes
app.register(taskRoutes);
// Project Routes
app.register(projectRoutes);

app.get("/health", async () => {
  return { status: "OK", timestamp: new Date().toISOString() };
});

const signals = ["SIGINT", "SIGTERM"];
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

async function start() {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
