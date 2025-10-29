import type { IClientRepository } from "../repositories/ICLientRepository";

export class DeleteClientService {
  private clientRepository: IClientRepository;
  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
