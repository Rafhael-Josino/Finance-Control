import { ICryptoUserRepository, ICryptoUserResponse } from '../../repositories/ICryptoUserRepository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    res: Response; // BAD
}

class GetUserUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    async execute( userName: string ): Promise<ICryptoUserResponse> {
        return await this.cryptoUserRepository.getUser(userName);
    }
}

export { GetUserUseCase };