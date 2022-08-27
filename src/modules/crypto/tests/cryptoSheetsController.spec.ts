import 'reflect-metadata';
import request from 'supertest';

import { app } from '@shared/infra/http/app';

import runMigrations from '@shared/infra/postgresSQL/migrations/migrationsReplicator';

import { CreateUserUseCase } from '@modules/accounts/useCases/createAccount/createUserUseCase';
import { ParserCryptoUseCase } from '../useCases/parser/parserUseCase';
import { DeleteUserUseCase } from '@modules/accounts/useCases/deleteAccount/deleteUserUseCase';
import { AccountRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';
import { CryptoRepositoryPG } from '@modules/crypto/infra/postgresSQL/repositories/CryptoRepositoryPG';
import { Account } from '@modules/accounts/infra/postgresSQL/models/Account';


describe("Parser sheets use case", () => {
    const accountRepository = new AccountRepositoryPG();
    const createAccountUseCase = new CreateUserUseCase(accountRepository);
    const deleteAccountUseCase = new DeleteUserUseCase(accountRepository);
    
    const cryptoRepository = new CryptoRepositoryPG();
    const parserCryptoUseCase = new ParserCryptoUseCase(cryptoRepository);
    
    let testUser: Account;
    let token: string;

    beforeAll(async () => {
        console.log("testing the prepare test database")
        
        await runMigrations();

        testUser = await createAccountUseCase.execute({
            userName: "test",
            password: "1234"
        });
        
        const responseToken = await request(app).post('/account/login').send({
            userName: "test",
            password: "1234"
        });

        token = responseToken.body.token;
    });

    
    afterAll(async () => {
        await deleteAccountUseCase.execute("test");

        await runMigrations(true);
    });
    

    it("should be able to parser the .xlsx file and return the names of the sheets saved", async () => {
        const response = await request(app).post("/cryptocoin/saveSheet/yes")
        .set({ 
            Authorization: `Bearer ${token}`,
            username: 'test'
        });
        
        expect(response.body.sheetsParsed).toEqual(expect.arrayContaining(["sheet1", "sheet2"]));
    });
    
    it("should no be able to execute if 'overwrite' argument is not [yes/no]", async () => {
        const response = await request(app).post("/cryptocoin/saveSheet/error")
        .set({ 
            Authorization: `Bearer ${token}`,
            username: 'test'
        }).expect(400);
    });

    it("should not be able to parse the same sheets if overwrite is passed as 'no'", async () => {
        const response = await request(app).post("/cryptocoin/saveSheet/no")
        .set({ 
            Authorization: `Bearer ${token}`,
            username: 'test'
        });

        expect(response.body.sheetsParsed.length).toEqual(0);
    });
});