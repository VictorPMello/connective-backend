import type { FastifyInstance } from "fastify";
import { prisma } from "../../config/database";

import { PrismaAccountRepository } from "./repositories/PrismaAccountRepository";
import { AccountController } from "./controllers/AccountController";
import { CreateAccountService } from "./services/CreateAccountService";
import { GetAccountService } from "./services/GetAccountService";
import { UpdateAccountService } from "./services/UpdateAccountService";
import { DeleteAccountService } from "./services/DeleteAccountService";
import { authMiddleware } from "../../middlewares/authMiddleware";

export async function accountRoutes(app: FastifyInstance) {
  const accountRepository = new PrismaAccountRepository(prisma);

  const createAccountService = new CreateAccountService(accountRepository);
  const getAccountService = new GetAccountService(accountRepository);
  const updateAccountService = new UpdateAccountService(accountRepository);
  const deleteAccountService = new DeleteAccountService(accountRepository);

  const accountController = new AccountController(
    createAccountService,
    getAccountService,
    updateAccountService,
    deleteAccountService,
  );

  app.post("/auth/register", (request, reply) =>
    accountController.create(request, reply),
  );

  app.get("/account/:id", { preHandler: [authMiddleware] }, (request, reply) =>
    accountController.getById(request, reply),
  );

  app.put(
    "/account/:id",
    { preHandler: [authMiddleware] },
    (request, reply) => {
      accountController.update(request, reply);
    },
  );

  app.patch(
    "/account/:id/last-login",
    { preHandler: [authMiddleware] },
    (request, reply) => {
      accountController.updateLastLogin(request, reply);
    },
  );

  app.patch(
    "/account/:id/password",
    { preHandler: [authMiddleware] },
    (request, reply) => {
      accountController.updatePassword(request, reply);
    },
  );

  app.delete(
    "/account/:id",
    { preHandler: [authMiddleware] },
    (request, reply) => {
      accountController.delete(request, reply);
    },
  );
}
