import type { Account } from "../dtos/account.types";
import type { IAccountRepository } from "../repositories/IAccountRepository";

export class GetAccountService {
  private accountRepository: IAccountRepository;
  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async getAccountById(id: string): Promise<Account | null> {
    const response = await this.accountRepository.findById(id);
    return response || null;
  }
}
