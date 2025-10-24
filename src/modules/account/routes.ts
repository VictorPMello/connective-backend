import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";

import { PrismaAccountRepository } from "./repositories/PrismaAccountRepository.ts";
import { AccountController } from "./controllers/AccountController.ts";
import { CreateAccountService } from "./services/CreateAccountService.ts";
import { GetAccountService } from "./services/GetAccountService.ts";
import { UpdateAccountService } from "./services/UpdateAccountService.ts";
import { DeleteAccountService } from "./services/DeleteAccountService.ts";

export async function accountRoutes(app: FastifyInstance) {
  const prima = new PrismaClient();

  const accountRepository = new PrismaAccountRepository(prima);

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

  app.post("/account", (request, reply) =>
    accountController.create(request, reply),
  );

  app.get("/account/:id", (request, reply) =>
    accountController.getById(request, reply),
  );

  app.put("/account/:id", (request, reply) => {
    accountController.update(request, reply);
  });

  app.patch("/account/:id/last-login", (request, reply) => {
    accountController.updateLastLogin(request, reply);
  });

  app.patch("/account/:id/password", (request, reply) => {
    accountController.updatePassword(request, reply);
  });

  app.delete("/account/:id", (request, reply) => {
    accountController.delete(request, reply);
  });
}
