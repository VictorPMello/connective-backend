import type { Account } from "../dtos/account.types";
import type { IAccountRepository } from "../repositories/IAccountRepository";

import { PasswordHelper } from "../../../helpers/password.helper";

export class LoginService {
  private accountRepository: IAccountRepository;
  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async login(email: string, password: string): Promise<Account> {
    const account = await this.accountRepository.findByEmail(email);
    if (!account) throw new Error("Email or password incorrect!");

    if (!account.isActive) throw new Error("Account is inactive");

    const isPasswordValid = await PasswordHelper.compare(
      password,
      account.password,
    );

    if (!isPasswordValid) throw new Error("Invalid credentials");

    await this.accountRepository.updateLastLogin(account.id);

    return account;
  }
}
