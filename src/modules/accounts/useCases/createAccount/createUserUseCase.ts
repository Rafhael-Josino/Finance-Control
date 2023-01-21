import { IAccountRepository } from '../../repositories/IAccountRepository';
import { Account } from '@modules/accounts/infra/models/Account';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';
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

        // this should not be necessary
        // we must see how to handle the errors from the databank
        if (listUsers.includes(userName))
            throw new AppError(`Account ${userName} already exists`, 400);

        const passwordHash = await hash(password, 8);
        return await this.accountRepository.createUser({ userName, passwordHash });
    }
}

export { CreateUserUseCase };