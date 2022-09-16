import 'reflect-metadata';
import request from 'supertest';
import { hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';

import { app } from '@shared/infra/http/app';
import { PG } from '@shared/infra/postgresSQL'
import auth from '@config/auth';

import runMigrations from '@shared/infra/postgresSQL/migrations/migrationsReplicator';

import { AppError } from '@shared/errors/AppErrors';


describe ("Account module tests", () => {
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

    
    afterAll(async () => { await runMigrations(true); });
    

    it ("should be able to create a new user account", async () => {
        const response = await request(app).post('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        })
        .send({
            userName: 'test',
            password: '1234'
        })
        .expect(201);
        
       expect(response.body.newUser).toHaveProperty('id');
       expect(response.body.newUser).toHaveProperty('name', 'test');
       expect(response.body.newUser).toHaveProperty('password');
       expect(response.body.newUser).toHaveProperty('created_at');
       expect(response.body.newUser).toHaveProperty('isAdmin', false);
    });
    

    it ("should not be able to create an user account whose username already exists" , async () => {
        const response = await request(app).post('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        })
        .send({
            userName: 'test',
            password: '4321'
        })
        .expect(400);

        expect(response.body.message).toBe(`Account test already exists`);
    });
    

    it ("should be able to get an user account by the user name received", async () => {
        const response = await request(app).get('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
            username: 'test'
        })
        .expect(200);
        
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('name', 'test');
        expect(response.body.user).toHaveProperty('password');
        expect(response.body.user).toHaveProperty('created_at');
        expect(response.body.user).toHaveProperty('isAdmin', false);    
    });


    it ("should be able to list present accounts", async () => {
        await request(app).post('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        })
        .send({
            userName: 'test2',
            password: '4321'
        });
        
        const response = await request(app).get('/account/list/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        })
        .expect(200);
        
        expect(response.body.accountsList).toEqual(expect.arrayContaining(["admin", "test", "test2"]));
    });
    
    
    it ("should be able to delete an user account", async () => {
        await request(app).delete('/account/')
        .set({
            Authorization: `Bearer ${adminToken}`,
            username: 'test2'
        })
        .expect(204);
        
        const response = await request(app).get('/account/list/')
        .set({
            Authorization: `Bearer ${adminToken}`,
        });
        
        expect(response.body.accountsList).toEqual(expect.not.arrayContaining(['test2']));
    });


    it ("should be able to login with an account", async () => {
        const response = await request(app).post('/account/login')
        .send({
            userName: 'test',
            password: '1234'
        })
        .expect(200);

        expect(response.body).toHaveProperty("userName", "test");
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refresh_token");

        const loginVerification = () => {
            verify(
                response.body.token,
                auth.secret_token
            );
        } 
        expect(loginVerification).not.toThrow(AppError);
    });


    it ("should not be able to login with wrong user/password", async () => {
        const response = await request(app).post('/account/login')
        .send({
            userName: 'test',
            password: '12345'
        })
        .expect(403);

        expect(response.body.message).toBe("Username or password incorrect");

        const response2 = await request(app).post('/account/login')
        .send({
            userName: 'teste',
            password: '1234'
        })
        .expect(403);

        expect(response2.body.message).toBe("Username or password incorrect");
    });

    it ("should be able to receive new valid token and refresh token", async () => {
        const responseLogin = await request(app).post('/account/login')
        .send({
            userName: 'test',
            password: '1234'
        });

        const response = await request(app).post('/account/refreshLogin')
        .send({
            refresh_token: responseLogin.body.refresh_token
        })
        .expect(200);

        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("refresh_token");

        const loginVerification = () => {
            verify(
                response.body.token,
                auth.secret_token
            );
        } 
        expect(loginVerification).not.toThrow(AppError);    
    });
});