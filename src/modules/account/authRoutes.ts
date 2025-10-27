import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database.ts";

import { PrismaAccountRepository } from "./repositories/PrismaAccountRepository.ts";
import { LoginService } from "./services/LoginService.ts";
import { AuthController } from "./controllers/AuthController.ts";
import { authMiddleware } from "../../middlewares/authMiddleware.ts";

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
