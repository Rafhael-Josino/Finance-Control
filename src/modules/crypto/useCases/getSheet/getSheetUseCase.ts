import { ICryptoUserRepository } from '../../repositories/ICryptoUserRepository';
import { Response } from 'express' // BAD

interface IRequest {
    userName: string;
    sheetName: string;
    res: Response; // BAD
}

class GetSheetUseCase {
    constructor(private cryptoUserRepository: ICryptoUserRepository) {}

    execute({ userName, sheetName, res}: IRequest) {
        this.cryptoUserRepository.getSheet({ userName, sheetName, res });
    }
}

export { GetSheetUseCase };