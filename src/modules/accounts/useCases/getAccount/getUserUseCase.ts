import { ICryptoUserRepository } from '../../repositories/AccountRepository';
import { inject, injectable } from 'tsyringe';
import { Account } from '../../models/Account';

@injectable()
class GetUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( userName: string ): Promise<Account> {
        return await this.cryptoUserRepository.getUser(userName);
    }
}

export { GetUserUseCase };