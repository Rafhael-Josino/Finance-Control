import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( userName: string ): Promise<ICryptoUserResponse> {
        return await this.cryptoUserRepository.getUser(userName);
    }
}

export { GetUserUseCase };