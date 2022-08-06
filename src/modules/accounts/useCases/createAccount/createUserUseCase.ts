import { IAccountRepository } from '../../repositories/IAccountRepository';
import { Account } from '@modules/accounts/infra/postgresSQL/models/Account';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

interface IRequest {
    userName: string;
    password: string;
}

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute( { userName, password }: IRequest ): Promise<Account> {
        const passwordHash = await hash(password, 8);

        return await this.accountRepository.createUser({ userName, passwordHash });
    }
}

export { CreateUserUseCase };