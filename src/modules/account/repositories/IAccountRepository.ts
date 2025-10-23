import type { Account, Client, Project, PlanType } from "@prisma/client";

export type { Account, PlanType };

export type AccountWithRelations = Account & {
  clients: Client[];
  projects: Project[];
};

export interface CreateAccountData {
  name: string;
  email: string;
  password: string;

  plan: PlanType;
  planExpiresAt?: Date;

  maxProjects: number;
  maxClients: number;
}

export interface UpdateAccountData {
  name?: string;
  email?: string;

  plan?: PlanType;
  planExpiresAt?: Date;

  maxProjects?: number;
  maxClients?: number;

  isActive?: boolean;

  updatedAt: Date;
}

export interface UpdatePasswordAccount {
  password: string;
}

export interface FindAccountsFilters {
  search?: string;
  plan?: PlanType;
  isActive?: boolean;
  limit: number;
  orderBy: "name" | "email" | "createdAt" | "plan";
  order: "asc" | "desc";
}

export interface IAccountRepository {
  create(data: CreateAccountData): Promise<Account>;

  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findAll(
    filters: FindAccountsFilters,
  ): Promise<{ accounts: Account[]; total: number }>;

  update(id: string, data: UpdateAccountData): Promise<Account>;
  updateLastLogin(id: string): Promise<void>;
  UpdatePasswordAccount(id: string, password: string): Promise<void>;

  delete(id: string): Promise<void>;
}
