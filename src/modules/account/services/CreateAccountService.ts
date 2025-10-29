import type { Account } from "../dtos/account.types";
import type { CreateAccountDTO } from "../dtos/createAccountDTO";
import type { IAccountRepository } from "../repositories/IAccountRepository";

import { PasswordHelper } from "../../../helpers/password.helper";

export class CreateAccountService {
  private accountRepository: IAccountRepository;
  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const accountExists = await this.accountRepository.findByEmail(data.email);
    if (accountExists) throw new Error("Email already in use!");

    const hashedPassword = await PasswordHelper.hash(data.password);

    const response = await this.accountRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      plan: data.plan || "FREE",
      maxProjects: data.maxProjects || 3,
      maxClients: data.maxClients || 10,
    });
    return response;
  }
}
