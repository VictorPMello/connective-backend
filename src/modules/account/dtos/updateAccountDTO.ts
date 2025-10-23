import type { PlanType } from "./account.types.ts";

export interface UpdateAccountDTO {
  name?: string;
  email?: string;

  plan?: PlanType;
  planExpiresAt?: Date;

  maxProjects?: number;
  maxClients?: number;

  isActive?: boolean;

  updatedAt: Date;
}
