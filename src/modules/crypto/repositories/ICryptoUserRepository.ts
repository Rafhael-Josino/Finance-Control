import { CryptoUser } from '../models/CryptoUser';
import { Response } from 'express'; // BAD
import { ICryptoRepository } from './ICryptoRespository';

interface ICryptoUserRepositoryDTO {
    userName: string;
    res: Response; // BAD
}

interface ICryptoUserRepository {
    listUsers(res: Response): void;
    getUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    createUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    listSheets({ userName, res}: ICryptoUserRepositoryDTO): void;
}

export { ICryptoUserRepository, ICryptoUserRepositoryDTO };
