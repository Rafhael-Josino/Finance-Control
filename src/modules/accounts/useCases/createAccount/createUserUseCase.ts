import { IAccountRepository } from '../../repositories/IAccountRepository';
import { Account } from '@modules/accounts/infra/postgresSQL/models/Account';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';
import { AppError } from '@shared/errors/AppErrors';

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
        const listUsers = await this.accountRepository.listUsers();

        if (listUsers.includes(userName))
            throw new AppError(`Account ${userName} already exists`, 400);

        const passwordHash = await hash(password, 8);
        return await this.accountRepository.createUser({ userName, passwordHash });
    }
}

export { CreateUserUseCase };