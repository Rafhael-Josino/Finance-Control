import { IAccountRepository } from '../../repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute( userName: string ): Promise<void> {
        await this.accountRepository.deleteUser(userName);
    }
}

export { DeleteUserUseCase };