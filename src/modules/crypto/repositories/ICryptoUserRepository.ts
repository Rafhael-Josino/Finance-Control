import { Response } from 'express'; // BAD

// Function arguments types

interface ICryptoUserRepositoryDTO {
    userName: string;
    res: Response; // BAD
}

interface ICryptoUserGetSheetDTO {
    userName: string;
    sheetName: string;
    res: Response; // BAD
}

// Function return types

interface ICryptoResponse {
    status: number;
    message: string;
}

interface ICryptoListSheetsResponse {
    status: number;
    sheetsList?: string[];
    errorMessage?: string;
}

// Repository interface

interface ICryptoUserRepository {
    listUsers(res: Response): void;
    getUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    createUser({ userName, res}: ICryptoUserRepositoryDTO): void;
    listSheets( userName: string ): ICryptoListSheetsResponse;
    getSheet({ userName, sheetName, res }: ICryptoUserGetSheetDTO): void;
}

export { 
    ICryptoUserRepository,
    ICryptoUserRepositoryDTO,
    ICryptoUserGetSheetDTO,
    ICryptoResponse,
    ICryptoListSheetsResponse
};
