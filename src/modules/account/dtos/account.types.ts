export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: PlanType;
  planExpiresAt: Date | null;
  maxProjects: number;
  maxClients: number;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum PlanType {
  FREE = "FREE",
  BASIC = "BASIC",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}
