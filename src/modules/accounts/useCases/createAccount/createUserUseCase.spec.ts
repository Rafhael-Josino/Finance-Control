import 'reflect-metadata';
import { CreateUserUseCase } from './createUserUseCase';
import { AccountRepositoryInMemory } from '../../infra/postgresSQL/repositories/AccountRepositoryInMemory';
import { Account } from '@modules/accounts/infra/postgresSQL/models/Account';
import { AppError } from '@shared/errors/AppErrors';

let createUserUseCase: CreateUserUseCase;
let accountRepositoryInMemory: AccountRepositoryInMemory;

describe("Create User Account", () => {
    beforeEach(() => {
        accountRepositoryInMemory = new AccountRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(accountRepositoryInMemory);
    });

    it("should be able to create a new user account", async () => {
        const newAccount = await createUserUseCase.execute({
            userName: "rafhael",
            password: "12345"
        });

        expect(newAccount).toBeInstanceOf(Account);
        expect(newAccount).toHaveProperty("id");
        expect(newAccount).toHaveProperty("password");
        expect(newAccount).toHaveProperty("name", "rafhael");
    });

    it("should not be able to create an user account whose username already exists", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                userName: "rafhael",
                password: "12345"
            });
    
            await createUserUseCase.execute({
                userName: "rafhael",
                password: "54321"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});