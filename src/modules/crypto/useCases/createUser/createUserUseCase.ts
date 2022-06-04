import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';

class CreateUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    async execute( userName: string ): Promise<ICryptoUserResponse> {
        return await this.cryptoUserRepository.createUser(userName);
    }
}

export { CreateUserUseCase };