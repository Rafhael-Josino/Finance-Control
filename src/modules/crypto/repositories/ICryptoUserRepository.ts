import { Response } from 'express'; // BAD

interface ICryptoUserRepositoryDTO {
    userName: string;
    res: Response; // BAD
}

interface ICryptoUserGetSheetDTO {
    userName: string;
    sheetName: string;
    res: Response; // BAD
}

interface ICryptoUserRepository {
    listUsers(res: Response): void;
    getUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    createUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    listSheets({ userName, res}: ICryptoUserRepositoryDTO): void;
    getSheet({ userName, sheetName, res }: ICryptoUserGetSheetDTO): void;
}

export { ICryptoUserRepository, ICryptoUserRepositoryDTO, ICryptoUserGetSheetDTO };
