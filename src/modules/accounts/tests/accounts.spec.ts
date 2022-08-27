import 'reflect-metadata';
import request from 'supertest';
import { hash } from 'bcrypt';

import { app } from '@shared/infra/http/app';
import { PG } from '@shared/infra/postgresSQL'

import runMigrations from '@shared/infra/postgresSQL/migrations/migrationsReplicator';

import { CreateUserUseCase } from '@modules/accounts/useCases/createAccount/createUserUseCase';
import { DeleteUserUseCase } from '@modules/accounts/useCases/deleteAccount/deleteUserUseCase';
import { AccountRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';


describe("Account module tests", () => {
    const accountRepository = new AccountRepositoryPG();
    const createAccountUseCase = new CreateUserUseCase(accountRepository);
    const deleteAccountUseCase = new DeleteUserUseCase(accountRepository);
    
    let adminToken: string;

    beforeAll(async () => {
        await runMigrations();

        const passwordHash = await hash('1234', 8);
        await PG.query(
            `INSERT INTO users (user_name, password, isadmin) VALUES ($1, $2, true)`,
            ['admin', passwordHash]
        );

        const responseToken = await request(app).post('/account/login').send({
            userName: "admin",
            password: "1234"
        });

        adminToken = responseToken.body.token;
    });

    
    afterAll(async () => {
        await deleteAccountUseCase.execute("admin");

        await runMigrations(true);
    });
    
    
    it ("should be able to create a new user account", async () => {
        const response = await request(app).post('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        })
        .send({
            userName: 'test',
            password: '1234'
        }).expect(201);
        
       expect(response.body.newUser).toHaveProperty('id');
       expect(response.body.newUser).toHaveProperty('name', 'test');
       expect(response.body.newUser).toHaveProperty('password');
       expect(response.body.newUser).toHaveProperty('created_at');
       expect(response.body.newUser).toHaveProperty('isAdmin', false);
    })
});