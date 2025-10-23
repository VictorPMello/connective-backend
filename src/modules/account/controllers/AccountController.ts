import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import type { CreateAccountService } from "../services/CreateAccountService.ts";
import type { GetAccountService } from "../services/GetAccountService.ts";
import type { UpdateAccountService } from "../services/UpdateAccountService.ts";
import type { DeleteAccountService } from "../services/DeleteAccountService.ts";

export class AccountController {
  private createAccountService: CreateAccountService;
  private getAccountService: GetAccountService;

  constructor(
    createAccountService: CreateAccountService,

    getAccountService: GetAccountService,
    // private updateAccountService: UpdateAccountService,
    // private deleteAccountService: DeleteAccountService,
  ) {
    this.createAccountService = createAccountService;
    this.getAccountService = getAccountService;
  }

  // CREATE

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createAccountSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      plan: z.enum(["FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE"]),
      maxProjects: z.number(),
      maxClients: z.number(),
    });

    const data = createAccountSchema.parse(request.body);
    const { password, ...accountWithOutPassword } =
      await this.createAccountService.createAccount(data);

    return reply.status(201).send({
      success: true,
      message: "Account created successfully",
      data: accountWithOutPassword,
    });
  }

  // GET

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });

    const { id } = paramsSchema.parse(request.params);
    const account = await this.getAccountService.getAccountById(id);

    if (!account) {
      return reply.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    const { password, ...accountWithOutPassword } = account;

    return reply.status(200).send({
      success: true,
      data: accountWithOutPassword,
    });
  }
}
