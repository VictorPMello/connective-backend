import type { ClientCategory, ClientStatus } from "@prisma/client";

export interface CreateClientDTO {
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
