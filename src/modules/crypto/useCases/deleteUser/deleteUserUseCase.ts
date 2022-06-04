import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';

class DeleteUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    async execute( userName: string ): Promise<ICryptoUserResponse> {
        return await this.cryptoUserRepository.deleteUser(userName);
    }
}

export { DeleteUserUseCase };