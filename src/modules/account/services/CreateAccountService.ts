import type { Account } from "../dtos/account.types.ts";
import type { CreateAccountDTO } from "../dtos/createAccountDTO.ts";
import type { IAccountRepository } from "../repositories/IAccountRepository.ts";

import bcrypt from "bcrypt";

export class CreateAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const accountExists = await this.accountRepository.findByEmail(data.email);

    if (accountExists) throw new Error("Emmail already in use!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

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
