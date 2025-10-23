import type { PlanType } from "./account.types.ts";

export interface CreateAccountDTO {
  name: string;
  email: string;
  password: string;
  plan?: PlanType;
  planExpiresAt?: Date;
  maxProjects?: number;
  maxClients?: number;
}
