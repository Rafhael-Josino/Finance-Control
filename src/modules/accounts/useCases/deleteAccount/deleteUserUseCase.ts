import { ICryptoUserRepository } from '../../repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( userName: string ): Promise<void> {
        await this.cryptoUserRepository.deleteUser(userName);
    }
}

export { DeleteUserUseCase };