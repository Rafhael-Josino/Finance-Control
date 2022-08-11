import 'reflect-metadata';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { CreateUserUseCase } from '../createAccount/createUserUseCase';
import { ListUsersUseCase } from '../listAccounts/listUsersUseCase';
import { AccountRepositoryInMemory } from '../../infra/postgresSQL/repositories/AccountRepositoryInMemory';

let deleteUserUseCase: DeleteUserUseCase;
let createUserUseCase: CreateUserUseCase;
let listUsersUseCase: ListUsersUseCase;
let accountRepositoryInMemory: AccountRepositoryInMemory;

describe("Create User Account", () => {
    beforeEach(() => {
        accountRepositoryInMemory = new AccountRepositoryInMemory();
        deleteUserUseCase = new DeleteUserUseCase(accountRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(accountRepositoryInMemory);
        listUsersUseCase = new ListUsersUseCase(accountRepositoryInMemory);
    });

    it("should be able to delete a user account", async () => {
        await createUserUseCase.execute({
            userName: "rafhael",
            password: "12345"
        });

        await deleteUserUseCase.execute('rafhael');

        const usersList = await listUsersUseCase.execute();

        expect(usersList.includes('rafhael')).toBe(false);
    });
});