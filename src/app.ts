import { fastify } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastifyMultipart } from "@fastify/multipart";
import fastifyJWT from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./config/env.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

import { authRoutes } from "./modules/account/authRoutes.ts";
import { accountRoutes } from "./modules/account/routes.ts";
import { taskRoutes } from "./modules/tasks/routes.ts";
import { projectRoutes } from "./modules/projects/routes.ts";
import { clientRoutes } from "./modules/clients/routes.ts";
import { email } from "zod";

export async function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  // JWT
  await app.register(fastifyJWT, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: "7d" },
  });

  // COOKIES
  await app.register(fastifyCookie, {
    secret: env.JWT_SECRET,
    parseOptions: {},
  });

  // HELMET
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

  // CORS
  await app.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // LIMIT RATE
  await app.register(fastifyRateLimit, {
    global: true,
    max: 10,
    timeWindow: 60000,
    continueExceeding: false,
    cache: 10000,
    keyGenerator: (request) => {
      const body = request.body as any;
      const email = body?.email;
      const ip = (request.headers["x-forwarded-for"] as string) || request.ip;

      return email ? `${ip}:${email}` : ip;
    },
  });

  // MULTIPART
  await app.register(fastifyMultipart);

  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  app.setErrorHandler(errorHandler);

  // Auth Routes
  app.register(authRoutes);
  // Account Routes
  app.register(accountRoutes);
  // Task Routes
  app.register(taskRoutes);
  // Project Routes
  app.register(projectRoutes);
  // Client Routes
  app.register(clientRoutes);

  app.get("/health", async () => {
    return { status: "OK", timestamp: new Date().toISOString() };
  });

  return app;
}
