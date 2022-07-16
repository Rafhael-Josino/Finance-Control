import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( userName: string ): Promise<ICryptoUserResponse> {
        return await this.cryptoUserRepository.deleteUser(userName);
    }
}

export { DeleteUserUseCase };