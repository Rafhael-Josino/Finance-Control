import 'reflect-metadata';
import { AccountRepositoryInMemory } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryInMemory';
import { GetUserUseCase } from './getUserUseCase';
import { CreateUserUseCase } from '../createAccount/createUserUseCase';
import { Account } from '@modules/accounts/infra/postgresSQL/models/Account';

let getUserUseCase: GetUserUseCase;
let createUserUseCase: CreateUserUseCase;
let accountRepositoryInMemory: AccountRepositoryInMemory;

describe("Get User Account", () => {
    beforeEach(() => {
        accountRepositoryInMemory = new AccountRepositoryInMemory();
        getUserUseCase = new GetUserUseCase(accountRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(accountRepositoryInMemory);
    });

    it("should be able to get an user account by the user name received", async () => {
        await createUserUseCase.execute({
            userName: "rafhael",
            password: "12345"
        });
    
        const account = await getUserUseCase.execute("rafhael");
    
        expect(account).toBeInstanceOf(Account);
        expect(account).toHaveProperty("id");
        expect(account).toHaveProperty("password");
        expect(account).toHaveProperty("name", "rafhael");
    });
});