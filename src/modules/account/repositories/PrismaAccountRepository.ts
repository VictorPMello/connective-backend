import { PrismaClient } from "@prisma/client";
import type {
  IAccountRepository,
  Account,
  CreateAccountData,
  UpdateAccountData,
  FindAccountsFilters,
} from "./IAccountRepository.ts";

export class PrismaAccountRepository implements IAccountRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateAccountData): Promise<Account> {
    const account = await this.prisma.account.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        plan: data.plan || "FREE",
        maxProjects: data.maxProjects || 3,
        maxClients: data.maxClients || 10,
        // planExpiresAt: data.planExpiresAt
      },
    });
    return account;
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({ where: { id } });

    return account || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({ where: { email } });
    return account || null;
  }

  async findAll(
    filters: FindAccountsFilters,
  ): Promise<{ accounts: Account[]; total: number }> {
    const { search, plan, isActive, limit, orderBy, order } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (plan) {
      where.plan = plan;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [accounts, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        take: limit,
        orderBy: {
          [orderBy]: order,
        },
      }),
      this.prisma.account.count({ where }),
    ]);

    return { accounts, total };
  }

  async update(id: string, data: UpdateAccountData): Promise<Account> {
    const account = await this.prisma.account.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return account;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async UpdatePasswordAccount(id: string, password: string): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: { password },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }
}
