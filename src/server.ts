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

app.get("/health", async () => {
  return { status: "OK", timestamp: new Date().toISOString() };
});

app.setErrorHandler((error, request, reply) => {
  console.error(error);

  if (error.validation) {
    return reply
      .status(400)
      .send({ error: "Validation Error", issues: error.validation });
  }

  return reply.status(500).send({ error: "Internal Server Error" });
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
