import { ICryptoUserRepository, ICryptoListUsersResponse } from '../../repositories/ICryptoUserRepository';

class ListUsersUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    async execute(): Promise<ICryptoListUsersResponse> {
        return await this.cryptoUserRepository.listUsers();
    }
}

export { ListUsersUseCase };