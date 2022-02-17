import { ICryptoUserRepository } from '../../repositories/ICryptoUserRepository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    res: Response; // BAD
}

class GetUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute({ userName, res}: IRequest) {
        this.cryptoUserRepository.getUser({ userName, res });
    }
}

export { GetUserUseCase };