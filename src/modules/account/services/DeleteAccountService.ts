import type { IAccountRepository } from "../repositories/IAccountRepository.ts";

export class DeleteAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  async deleteAccount(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
