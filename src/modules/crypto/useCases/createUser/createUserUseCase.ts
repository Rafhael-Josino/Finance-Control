import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';

class CreateUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute( userName: string ): ICryptoUserResponse {
        return this.cryptoUserRepository.createUser(userName);
    }
}

export { CreateUserUseCase };