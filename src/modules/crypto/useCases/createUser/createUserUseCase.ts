import { ICryptoUserRepository, ICryptoResponse } from '../../repositories/ICryptoUserRepository';

class CreateUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    async execute( userName: string ): Promise<ICryptoResponse> {
        return await this.cryptoUserRepository.createUser(userName);
    }
}

export { CreateUserUseCase };