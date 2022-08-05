import { ICryptoUserRepository } from '../../repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

interface IRequest {
    userName: string;
    password: string;
}

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("CryptoUserRepository")
        private cryptoUserRepository: ICryptoUserRepository
    ) {}

    async execute( { userName, password }: IRequest ): Promise<void> {
        const passwordHash = await hash(password, 8);

        await this.cryptoUserRepository.createUser({ userName, passwordHash });
    }
}

export { CreateUserUseCase };