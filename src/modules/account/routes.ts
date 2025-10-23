import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { PrismaAccountRepository } from "./repositories/PrismaAccountRepository.ts";
import { CreateAccountService } from "./services/CreateAccountService.ts";
import { AccountController } from "./controllers/AccountController.ts";
import { GetAccountService } from "./services/GetAccountService.ts";

export async function accountRoutes(app: FastifyInstance) {
  const prima = new PrismaClient();

  const accountRepository = new PrismaAccountRepository(prima);

  const createAccountService = new CreateAccountService(accountRepository);
  const getAccountService = new GetAccountService(accountRepository);

  const accountController = new AccountController(
    createAccountService,
    getAccountService,
  );

  app.post("/account", (request, reply) =>
    accountController.create(request, reply),
  );

  app.get("/account/:id", (request, reply) =>
    accountController.getById(request, reply),
  );
}
