import { PrismaClient } from "@prisma/client";

import type {
  Client,
  CreateClientData,
  UpdateClientData,
  IClientRepository,
} from "./ICLientRepository.ts";

export class PrismaClientRepository implements IClientRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async create(data: CreateClientData): Promise<Client> {
    const client = await this.prisma.client.create({
      data: {
        accountId: data.accountId,

        name: data.name,
        contactPerson: data.contactPerson,

        email: data.email,
        phone: data.phone,

        status: data.status,
        category: data.category,

        manager: data.manager,
        hiringDate: data.hiringDate,
      },
    });

    return client;
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { address: true },
    });
    return client;
  }

  async findAll(accountId: string): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: { accountId },
      include: { address: true },
    });
    return clients;
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const { address, ...clientData } = data;

    const client = await this.prisma.client.update({
      where: { id },
      data: {
        ...clientData,

        updatedAt: new Date(),
        ...(address && {
          address: {
            upsert: {
              create: address,
              update: address,
            },
          },
        }),
      },
      include: { address: true },
    });

    return client;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }
}
