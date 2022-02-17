import { ICryptoUserRepository } from '../../repositories/ICryptoUserRepository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    res: Response; // BAD
}

class CreateUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute({ userName, res}: IRequest) {
        this.cryptoUserRepository.createUser({ userName, res });
    }
}

export { CreateUserUseCase };