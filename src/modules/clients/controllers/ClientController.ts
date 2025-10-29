import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { CreateClientService } from "../services/CreateClientService";
import { GetClientService } from "../services/GetClientService";
import { UpdateClientService } from "../services/UpdateClientService";
import { DeleteClientService } from "../services/DeleteClientService";

export class ClientController {
  private createClientService: CreateClientService;
  private getClientService: GetClientService;
  private updateClientService: UpdateClientService;
  private deleteClientService: DeleteClientService;

  constructor(
    createClientService: CreateClientService,
    getClientService: GetClientService,
    updateClientService: UpdateClientService,
    deleteClientService: DeleteClientService,
  ) {
    this.createClientService = createClientService;
    this.getClientService = getClientService;
    this.updateClientService = updateClientService;
    this.deleteClientService = deleteClientService;
  }

  // CREATE

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createClientSchema = z.object({
      accountId: z.string(),
      name: z.string(),
      contactPerson: z.string(),
      email: z.string(),
      phone: z.string(),
      manager: z.string(),

      status: z.enum(["ACTIVE", "NEGOTIATION", "INACTIVE", "PROSPECTUS"]),
      category: z.enum(["BASIC", "PREMIUM", "ENTERPRISE"]),
    });

    const data = createClientSchema.parse(request.body);
    const newCLient = await this.createClientService.createClient({
      ...data,
      hiringDate: new Date(),
    });

    return reply.status(201).send({
      success: true,
      message: "Client created successfully",
      data: newCLient,
    });
  }
  // GET

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const client = await this.getClientService.getClientById(id);

    if (!client) {
      return reply.status(404).send({
        success: false,
        message: "Client not found",
      });
    }

    return reply.status(200).send({
      success: true,
      data: client,
    });
  }

  async getAllClients(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ accountId: z.string().uuid() });
    const { accountId } = paramsSchema.parse(request.params);

    const clients = await this.getClientService.getAllClients(accountId);

    return reply.status(200).send({
      success: true,
      data: clients,
      total: clients.length,
    });
  }

  // UPDATE

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const updateClientSchema = z.object({
      name: z.string().optional(),
      contactPerson: z.string().optional(),

      email: z.string().email().optional(),
      phone: z.string().optional(),
      secundaryEmail: z.string().optional(),
      secundaryPhone: z.string().optional(),

      status: z
        .enum(["ACTIVE", "NEGOTIATION", "INACTIVE", "PROSPECTUS"])
        .optional(),
      category: z.enum(["BASIC", "PREMIUM", "ENTERPRISE"]).optional(),

      manager: z.string().optional(),

      hiringDate: z.coerce.date().optional(),
      nextDueDate: z.coerce.date().optional(),
      lastContact: z.coerce.date().optional(),
      monthlyAmount: z.string().optional(),

      address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        complement: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      }),
      cnpj: z.string().optional(),
      cpf: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),

      paymentMethod: z
        .enum(["CREDIT_CARD", "BOLETO", "PIX", "TRANSFER"])
        .optional(),
      notes: z.string().optional(),
    });

    const data = updateClientSchema.parse(request.body);

    const client = await this.updateClientService.updateClient(id, {
      ...data,
      updatedAt: new Date(),
    });

    return reply.status(200).send({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  }

  // DELETE

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    await this.deleteClientService.deleteClient(id);

    return reply.status(200).send({
      success: true,
      message: "Client deleted successfully",
    });
  }
}
