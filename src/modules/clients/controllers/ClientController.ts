import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { CreateClientService } from "../services/CreateClientService.ts";
import { GetClientService } from "../services/GetClientService.ts";
import { UpdateClientService } from "../services/UpdateClientService.ts";
import { DeleteClientService } from "../services/DeleteClientService.ts";

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
      name: z.string(),
      contactPerson: z.string(),

      email: z.string().email(),
      phone: z.string(),
      secundaryEmail: z.string(),
      secundaryPhone: z.string(),

      status: z.enum(["ACTIVE", "NEGOTIATION", "INACTIVE", "PROSPECTUS"]),
      category: z.enum(["BASIC", "PREMIUM", "ENTERPRISE"]),

      manager: z.string(),

      hiringDate: z.coerce.date().optional(),
      nextDueDate: z.coerce.date(),
      lastContact: z.coerce.date(),
      monthlyAmount: z.string(),

      address: z.object({
        street: z.string(),
        number: z.string(),
        complement: z.string(),
        neighborhood: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
      }),
      cnpj: z.string(),
      cpf: z.string(),
      website: z.string(),
      linkedin: z.string(),

      paymentMethod: z.enum(["CREDIT_CARD", "BOLETO", "PIX", "TRANSFER"]),
      notes: z.string(),
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
