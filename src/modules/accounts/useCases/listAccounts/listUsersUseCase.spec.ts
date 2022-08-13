import 'reflect-metadata';
import { CreateUserUseCase } from '../createAccount/createUserUseCase';
import { ListUsersUseCase } from './listUsersUseCase';
import { AccountRepositoryInMemory } from '../../repositories/inMemory/AccountRepositoryInMemory';

let createUserUseCase: CreateUserUseCase;
let listUsersUseCase: ListUsersUseCase;
let accountRepositoryInMemory: AccountRepositoryInMemory;

describe("Create User Account", () => {
    beforeEach(() => {
        accountRepositoryInMemory = new AccountRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(accountRepositoryInMemory);
        listUsersUseCase = new ListUsersUseCase(accountRepositoryInMemory);
    });

    it("should be able to return a list of users's names", async () => {
        await createUserUseCase.execute({
            userName: "rafhael",
            password: "12345"
        });

        await createUserUseCase.execute({
            userName: "rodion",
            password: "54321"
        });

        const usersList = await listUsersUseCase.execute();

        expect(usersList).toEqual(expect.arrayContaining(['rafhael', 'rodion']));
    });
});