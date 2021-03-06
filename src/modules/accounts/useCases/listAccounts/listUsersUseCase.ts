import { ICryptoUserRepository } from '../../repositories/AccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListUsersUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute(): Promise<string[]> {
        return await this.cryptoUserRepository.listUsers();
    }
}

export { ListUsersUseCase };