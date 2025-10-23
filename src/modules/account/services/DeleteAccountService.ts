import type { IAccountRepository } from "../repositories/IAccountRepository.ts";

export class DeleteAccountService {
  private accountRepository: IAccountRepository;
  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
