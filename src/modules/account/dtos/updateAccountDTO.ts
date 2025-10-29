import type { PlanType } from "./account.types";

export interface UpdateAccountDTO {
  name?: string | undefined;
  email?: string | undefined;

  plan?: PlanType | undefined;
  planExpiresAt?: Date | undefined;

  maxProjects?: number | undefined;
  maxClients?: number | undefined;

  isActive?: boolean | undefined;

  updatedAt: Date;
}
