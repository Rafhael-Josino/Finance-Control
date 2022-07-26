import { Account } from '../models/Account';

interface ICryptoUserRepository {
    listUsers(): Promise<string[]>;
    getUser( username: string ): Promise<Account>;
    createUser( userName: string ): Promise<void>;
    deleteUser( userName: string ): Promise<void>;
}

export { ICryptoUserRepository };