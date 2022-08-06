import { IAccountRepository } from '../../repositories/IAccountRepository';
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

    async execute( { userName, password }: IRequest ): Promise<void> {
        const passwordHash = await hash(password, 8);

        await this.accountRepository.createUser({ userName, passwordHash });
    }
}

export { CreateUserUseCase };