import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import type { CreateAccountService } from "../services/CreateAccountService.ts";
import type { GetAccountService } from "../services/GetAccountService.ts";
import type { UpdateAccountService } from "../services/UpdateAccountService.ts";
import type { DeleteAccountService } from "../services/DeleteAccountService.ts";

export class AccountController {
  private createAccountService: CreateAccountService;
  private getAccountService: GetAccountService;
  private updateAccountService: UpdateAccountService;
  private deleteAccountService: DeleteAccountService;

  constructor(
    createAccountService: CreateAccountService,

    getAccountService: GetAccountService,
    updateAccountService: UpdateAccountService,
    deleteAccountService: DeleteAccountService,
  ) {
    this.createAccountService = createAccountService;
    this.getAccountService = getAccountService;
    this.updateAccountService = updateAccountService;
    this.deleteAccountService = deleteAccountService;
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

  // UPDATE

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const updateAccountSchema = z.object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      plan: z.enum(["FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE"]).optional(),
      maxProjects: z.number().optional(),
      maxClients: z.number().optional(),
    });

    const data = updateAccountSchema.parse(request.body);

    const { password, ...accountWithOutPassword } =
      await this.updateAccountService.updateAccount(id, {
        ...data,
        updatedAt: new Date(),
      });

    return reply.status(200).send({
      success: true,
      message: "Account updated successfully",
      data: accountWithOutPassword,
    });
  }

  async updateLastLogin(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);
    await this.updateAccountService.updateLastLoginAccount(id);

    return reply.status(200).send({
      success: true,
      message: "Last Login updated successfully",
    });
  }

  async updatePassword(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const verifyPassword = z.object({ password: z.string().min(6) });
    const { password } = verifyPassword.parse(request.body);

    await this.updateAccountService.updatePasswordAccount(id, password);

    return reply.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  }

  // DELETE

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });

    const { id } = paramsSchema.parse(request.params);
    await this.deleteAccountService.deleteAccount(id);

    return reply.status(200).send({
      success: true,
      message: "Account deleted successfully",
    });
  }
}
