import type { Account } from "../dtos/account.types.ts";
import type { UpdateAccountDTO } from "../dtos/updateAccountDTO.ts";
import type { IAccountRepository } from "../repositories/IAccountRepository.ts";

import { PasswordHelper } from "../../../helpers/password.helper.ts";

export class UpdateAccountService {
  private accountRepository: IAccountRepository;
  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async updateAccount(id: string, data: UpdateAccountDTO): Promise<Account> {
    const accountExists = await this.accountRepository.findById(id);
    if (!accountExists) throw new Error("Account not Exists!");

    const response = await this.accountRepository.update(id, data);
    return response;
  }

  async updateLastLoginAccount(id: string): Promise<void> {
    const accountExists = await this.accountRepository.findById(id);
    if (!accountExists) throw new Error("Account not Exists!");

    await this.accountRepository.updateLastLogin(id);
  }

  async updatePasswordAccount(id: string, password: string): Promise<void> {
    const accountExists = await this.accountRepository.findById(id);
    if (!accountExists) throw new Error("Account not Exists!");

    const hashedPassword = await PasswordHelper.hash(password);
    await this.accountRepository.UpdatePasswordAccount(id, hashedPassword);
  }
}
