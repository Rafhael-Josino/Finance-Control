import { IAccountRepository } from '../../repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';
import { Account } from '@modules/accounts/infra/models/Account';

@injectable()
class GetUserUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute( userName: string ): Promise<Account> {
        return await this.accountRepository.getUser(userName);
    }
}

export { GetUserUseCase };