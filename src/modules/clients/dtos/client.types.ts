export interface Task {
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
  secundaryEmail?: string;
  secundaryPhone?: string;

  // Status and category
  status: ClientStatus;
  category: ClientCategory;

  // Relationship
  manager: string;

  // Dates and values
  hiringDate: Date;
  nextDueDate?: Date;
  lastContact?: Date;
  monthlyAmount?: string;

  // Address
  address?: AddressInput;

  // Commercial information
  cnpj?: string;
  cpf?: string;
  website?: string;
  linkedin?: string;

  // Payment
  paymentMethod?: PaymentMethod;

  // Notes
  notes?: string;
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

export enum ClientStatus {
  ACTIVE = "active",
  NEGOTIATION = "negotiation",
  INACTIVE = "inactive",
  PROSPECTUS = "prospectus",
}

export enum ClientCategory {
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  BOLETO = "boleto",
  PIX = "pix",
  TRANSFER = "transfer",
}
