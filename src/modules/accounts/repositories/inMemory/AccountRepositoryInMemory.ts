import { IAccountRepository, ICreateUserDTO } from '../IAccountRepository';
import { Account } from '../../infra/postgresSQL/models/Account';
import { nanoid } from 'nanoid';

class AccountRepositoryInMemory implements IAccountRepository {
    accounts: Account[] = [];

    async listUsers(): Promise<string[]> {
        return this.accounts.map(account => account.name);
    }

    async getUser(username: string): Promise<Account> {
        const account = this.accounts.filter(account => account.name === username);
        return account[0];
    }

    async createUser({ userName, passwordHash }: ICreateUserDTO): Promise<Account> {
        const newAccount = new Account();
        Object.assign(newAccount, {
            id: nanoid(),
            name: userName,
            password: passwordHash,
            created_at: Date.now()
        });
        this.accounts.push(newAccount);

        return newAccount;
    }

    async deleteUser(userName: string): Promise<void> {
        const index = this.accounts.findIndex(account => account.name === userName);

        this.accounts.splice(index, 1);
    }
}

export { AccountRepositoryInMemory };