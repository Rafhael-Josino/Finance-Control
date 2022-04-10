import { ICryptoUserRepository, ICryptoListUsersResponse } from '../../repositories/ICryptoUserRepository';

class ListUsersUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute(): ICryptoListUsersResponse {
        return this.cryptoUserRepository.listUsers();
    }
}

export { ListUsersUseCase };