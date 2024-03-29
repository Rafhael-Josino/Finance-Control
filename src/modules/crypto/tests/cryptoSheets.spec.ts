import 'reflect-metadata';

import { AppError } from '@shared/errors/AppErrors';

import runMigrations from '@shared/infra/postgresSQL/migrations/migrationsBackup';

import { CreateUserUseCase } from '@modules/accounts/useCases/createAccount/createUserUseCase';
import { UploadSheetUseCase } from '../useCases/uploadSheet/uploadSheetUseCase';
import { DeleteUserUseCase } from '@modules/accounts/useCases/deleteAccount/deleteUserUseCase';
import { AccountRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';
import { CryptoRepositoryPG } from '@modules/crypto/infra/postgresSQL/repositories/CryptoRepositoryPG';
import { Account } from '@modules/accounts/infra/models/Account';


describe("Parser sheets use case", () => {
    const accountRepository = new AccountRepositoryPG();
    const createAccountUseCase = new CreateUserUseCase(accountRepository);
    const deleteAccountUseCase = new DeleteUserUseCase(accountRepository);
    
    const cryptoRepository = new CryptoRepositoryPG();
    const parserCryptoUseCase = new UploadSheetUseCase(cryptoRepository);
    
    let testUser: Account;

    beforeAll(async () => {
        await runMigrations();

        testUser = await createAccountUseCase.execute({
            userName: "test",
            password: "1234"
        });
    });

    
    afterAll(async () => { await runMigrations(true); });
    

    it("should be able to parser the .xlsx file and return the names of the sheets saved", async () => {
        const sheetsParsed = await parserCryptoUseCase.execute({
            username: testUser.name,
            userID: testUser.id,
            overwrite: "no"
        });

        expect(sheetsParsed).toEqual(expect.arrayContaining(["sheet1", "sheet2"]));
    });

    it("should no be able to execute if 'overwrite' argument is not [yes/no]", async () => {
        expect(async () => {
            const sheetsParsed = await parserCryptoUseCase.execute({
                username: testUser.name,
                userID: testUser.id,
                overwrite: "asdsadsadsad"
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to parse the same sheets if overwrite is passed as 'no'", async () => {
        const sheetsParsed = await parserCryptoUseCase.execute({
            username: testUser.name,
            userID: testUser.id,
            overwrite: "no"
        });

        expect(sheetsParsed.length).toEqual(0);
    })
});