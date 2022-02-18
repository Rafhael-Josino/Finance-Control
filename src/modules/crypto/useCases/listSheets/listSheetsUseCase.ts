import path from 'path';
import { ICryptoUserRepository } from '../../repositories/ICryptoUserRepository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    res: Response; // BAD
}

class ListSheetsUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute({ userName, res}: IRequest) {
        this.cryptoUserRepository.listSheets({ userName, res});
    }
}

export { ListSheetsUseCase };