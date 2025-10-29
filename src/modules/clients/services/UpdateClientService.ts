import type { Client } from "../dtos/client.types";
import type { UpdateClientDTO } from "../dtos/UpdateClientDTO";
import type { IClientRepository } from "../repositories/ICLientRepository";

export class UpdateClientService {
  private clientRepository: IClientRepository;
  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async updateClient(id: string, data: UpdateClientDTO): Promise<Client> {
    const clientExists = await this.clientRepository.findById(id);
    if (!clientExists) throw new Error("Client not Exists!");

    const client = await this.clientRepository.update(id, data);
    return client;
  }
}
