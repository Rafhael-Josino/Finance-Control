import { ICryptoUserRepository, ICryptoResponse } from '../../repositories/AccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( userName: string ): Promise<ICryptoResponse> {
        return await this.cryptoUserRepository.createUser(userName);
    }
}

export { CreateUserUseCase };