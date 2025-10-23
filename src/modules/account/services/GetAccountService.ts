import type { Account } from "../dtos/account.types.ts";
import type { IAccountRepository } from "../repositories/IAccountRepository.ts";

export class GetAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  async getAccountById(id: string): Promise<Account | null> {
    const response = await this.accountRepository.findById(id);
    return response || null;
  }
}
