import type { Client } from "../dtos/client.types.ts";
import type { IClientRepository } from "../repositories/ICLientRepository.ts";

export class GetClientService {
  private clientRepository: IClientRepository;
  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async getClientById(id: string): Promise<Client | null> {
    const client = await this.clientRepository.findById(id);
    return client;
  }

  async getAllClients(accountId: string): Promise<Client[]> {
    const clients = await this.clientRepository.findAll(accountId);
    return clients;
  }
}
