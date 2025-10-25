export type ClientStatus = "ACTIVE" | "NEGOTIATION" | "INACTIVE" | "PROSPECTUS";

export type ClientCategory = "BASIC" | "PREMIUM" | "ENTERPRISE";

export type PaymentMethod = "CREDIT_CARD" | "BOLETO" | "PIX" | "TRANSFER";

export interface Client {
  id: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Basic information
  name: string;
  contactPerson: string;

  // Contact
  email: string;
  phone: string;
  secundaryEmail?: string | null;
  secundaryPhone?: string | null;

  // Status and category
  status: ClientStatus;
  category: ClientCategory;

  // Relationship
  manager: string;

  // Dates and values
  hiringDate: Date;
  nextDueDate?: Date | null;
  lastContact?: Date | null;
  monthlyAmount?: string | null;

  // Address
  address?: AddressInput | null;

  // Commercial information
  cnpj?: string | null;
  cpf?: string | null;
  website?: string | null;
  linkedin?: string | null;

  // Payment
  paymentMethod?: PaymentMethod | null;

  // Notes
  notes?: string | null;
}

export interface AddressInput {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
