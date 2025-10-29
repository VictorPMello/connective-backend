import type {
  Client,
  ClientStatus,
  ClientCategory,
  PaymentMethod,
  Address,
} from "@prisma/client";
import type { AddressInput } from "../dtos/client.types";

export type { Client, ClientStatus, ClientCategory, Address };

export interface CreateClientData {
  accountId: string;
  name: string;
  contactPerson: string;

  email: string;
  phone: string;

  status: ClientStatus;
  category: ClientCategory;

  manager: string;
  hiringDate: Date;
}

export interface UpdateClientData {
  updatedAt: Date;

  name?: string;
  contactPerson?: string;

  email?: string;
  phone?: string;
  secundaryEmail?: string;
  secundaryPhone?: string;

  status?: ClientStatus;
  category?: ClientCategory;

  manager?: string;

  hiringDate?: Date;
  nextDueDate?: Date;
  lastContact?: Date;
  monthlyAmount?: string;

  address?: AddressInput;

  cnpj?: string;
  cpf?: string;
  website?: string;
  linkedin?: string;

  paymentMethod?: PaymentMethod;

  notes?: string;
}

export interface IClientRepository {
  create(data: CreateClientData): Promise<Client>;

  findById(id: string): Promise<Client | null>;
  findAll(accountId: string): Promise<Client[]>;

  update(id: string, data: UpdateClientData): Promise<Client>;

  delete(id: string): Promise<void>;
}
