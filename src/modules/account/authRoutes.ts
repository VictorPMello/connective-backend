import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database";

import { PrismaAccountRepository } from "./repositories/PrismaAccountRepository";
import { LoginService } from "./services/LoginService";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "../../middlewares/authMiddleware";

export async function authRoutes(app: FastifyInstance) {
  const accountRepository = new PrismaAccountRepository(prisma);
  const loginService = new LoginService(accountRepository);
  const authController = new AuthController(loginService);

  app.post("/auth/login", (request, reply) =>
    authController.login(request, reply),
  );

  app.post("/auth/logout", (request, reply) =>
    authController.logout(request, reply),
  );

  app.get("/auth/me", { preHandler: [authMiddleware] }, (request, reply) =>
    authController.me(request, reply),
  );
}
