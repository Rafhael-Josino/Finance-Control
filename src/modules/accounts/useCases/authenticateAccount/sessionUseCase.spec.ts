import 'reflect-metadata';
import { CreateUserUseCase } from '../createAccount/createUserUseCase';
import { AccountRepositoryInMemory } from '../../repositories/inMemory/AccountRepositoryInMemory';
import { SessionUseCase } from './sessionUseCase';
import { AppError } from '@shared/errors/AppErrors';

let sessionUseCase: SessionUseCase;
let createUserUseCase: CreateUserUseCase;
let accountRepositoryInMemory: AccountRepositoryInMemory;

describe("Create User Account", () => {
    beforeEach(() => {
        accountRepositoryInMemory = new AccountRepositoryInMemory();
        sessionUseCase = new SessionUseCase(accountRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(accountRepositoryInMemory);
    });

    it("should be able to validate a session with the correct username and password", async () => {
        await createUserUseCase.execute({
            userName: "rafhael",
            password: "12345"
        });

        const session = await sessionUseCase.execute({
            userName: 'rafhael',
            password: '12345'
        });

        expect(session).toHaveProperty('userName');
        expect(session).toHaveProperty('token');
    });

    it("should not be able to validate a session with a user that does not exists", async () => {
        expect(async () => {
            await sessionUseCase.execute({
                userName: 'rafhael',
                password: '12345'
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to validate a session with the wrong password", async () => {
        expect(async () => {
            await createUserUseCase.execute({
                userName: "rafhael",
                password: "12345"
            });

            await sessionUseCase.execute({
                userName: 'rafhael',
                password: '1234'
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});