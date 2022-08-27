import { Account } from '@modules/accounts/infra/models/Account';;

interface ICreateUserDTO {
    userName: string;
    passwordHash: string;
}

interface IAccountRepository {
    listUsers(): Promise<string[]>;
    getUser( username: string ): Promise<Account>;
    createUser( { userName, passwordHash }: ICreateUserDTO ): Promise<Account>;
    deleteUser( userName: string ): Promise<void>;
}

export { IAccountRepository, ICreateUserDTO };