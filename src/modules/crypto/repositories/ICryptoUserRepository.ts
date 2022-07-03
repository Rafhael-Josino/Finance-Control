import { CryptoUser } from '../models/CryptoUser';

// Function arguments types

// Function return types

interface ICryptoResponse {
    status: number;
    message?: string;
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
    createUser( userName: string ): Promise<ICryptoResponse>;
    deleteUser( userName: string ): Promise<ICryptoUserResponse>;
}

export { 
    ICryptoUserRepository,
    ICryptoResponse,
    ICryptoListUsersResponse,
    ICryptoUserResponse
};
