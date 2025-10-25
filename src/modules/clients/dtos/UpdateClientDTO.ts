import type {
  ClientCategory,
  ClientStatus,
  PaymentMethod,
} from "@prisma/client";
import type { AddressInput } from "./client.types.ts";

export interface UpdateClientDTO {
  name?: string;
  contactPerson?: string;

  email?: string;
  phone?: string;
  secundaryEmail?: string;
  secundaryPhone?: string;

  status?: ClientStatus;
  category?: ClientCategory;

  manager?: string;

  hiringDate?: Date | undefined;
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
  updatedAt: Date;
}
