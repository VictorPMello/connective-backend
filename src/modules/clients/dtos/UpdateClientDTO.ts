import type {
  ClientCategory,
  ClientStatus,
  PaymentMethod,
} from "@prisma/client";
import type { AddressInput } from "./client.types.ts";

export interface UpdateClientDTO {
  name?: string | undefined;
  contactPerson?: string | undefined;

  email?: string | undefined;
  phone?: string | undefined;
  secundaryEmail?: string | undefined;
  secundaryPhone?: string | undefined;

  status?: ClientStatus | undefined;
  category?: ClientCategory | undefined;

  manager?: string | undefined;

  hiringDate?: Date | undefined;
  nextDueDate?: Date | undefined;
  lastContact?: Date | undefined;
  monthlyAmount?: string | undefined;

  address?: AddressInput | undefined;

  cnpj?: string | undefined;
  cpf?: string | undefined;
  website?: string | undefined;
  linkedin?: string | undefined;

  paymentMethod?: PaymentMethod | undefined;

  notes?: string | undefined;
  updatedAt: Date;
}
