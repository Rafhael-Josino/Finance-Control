import { IAccountRepository } from '../../repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListUsersUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute(): Promise<string[]> {
        return await this.accountRepository.listUsers();
    }
}

export { ListUsersUseCase };