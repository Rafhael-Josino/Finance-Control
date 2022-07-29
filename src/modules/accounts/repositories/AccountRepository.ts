import { Account } from '../models/Account';

interface ICreateUserDTO {
    userName: string;
    passwordHash: string;
}

interface ICryptoUserRepository {
    listUsers(): Promise<string[]>;
    getUser( username: string ): Promise<Account>;
    createUser( { userName, passwordHash }: ICreateUserDTO ): Promise<void>;
    deleteUser( userName: string ): Promise<void>;
}

export { ICryptoUserRepository, ICreateUserDTO };