import type { Client } from "../dtos/client.types";
import type { CreateClientDTO } from "../dtos/CreateClientDTO";
import type { IClientRepository } from "../repositories/ICLientRepository";

export class CreateClientService {
  private clientRepository: IClientRepository;
  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async createClient(data: CreateClientDTO): Promise<Client> {
    const response = await this.clientRepository.create({
      accountId: data.accountId,

      name: data.name,
      contactPerson: data.contactPerson,

      email: data.email,
      phone: data.phone,

      status: data.status,
      category: data.category,

      manager: data.manager,
      hiringDate: data.hiringDate,
    });

    const { accountId, ...clientWithoutAccountId } = response;

    return clientWithoutAccountId;
  }
}
