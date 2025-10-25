import type { Client } from "../dtos/client.types.ts";
import type { CreateClientDTO } from "../dtos/CreateClientDTO.ts";
import type { IClientRepository } from "../repositories/ICLientRepository.ts";

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

    return response;
  }
}
