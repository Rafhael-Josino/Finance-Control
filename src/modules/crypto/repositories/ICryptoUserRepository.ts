import { Response } from 'express'; // BAD
import { CryptoUser } from '../models/CryptoUser';

// Function arguments types

interface ICryptoUserRepositoryDTO {
    userName: string;
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

interface ICryptoListUsersResponse {
    status: number;
    usersList?: string[];
    errorMessage?: string;
}

interface ICryptoUserResponse {
    status: number;
    cryptoUser?: CryptoUser;
    errorMessage?: string;
}

// Repository interface

interface ICryptoUserRepository {
    listUsers(): Promise<ICryptoListUsersResponse>;

    // getUser should return user info. but instead of all the CryptoSheets, only their names
    getUser( username: string ): Promise<ICryptoUserResponse>;
    
    createUser( userName: string ): Promise<ICryptoUserResponse>;
    listSheets( userName: string ): ICryptoListSheetsResponse;
}

export { 
    ICryptoUserRepository,
    ICryptoUserRepositoryDTO,
    ICryptoResponse,
    ICryptoListUsersResponse,
    ICryptoListSheetsResponse,
    ICryptoUserResponse
};
