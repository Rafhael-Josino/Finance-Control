import { PG } from '../../../../database';
import fs from 'fs';
import path from 'path';
import { CryptoUser } from '../../models/CryptoUser';
import {
    ICryptoUserRepository,
    ICryptoListUsersResponse,
    ICryptoUserResponse,
    ICryptoResponse
} from '../ICryptoUserRepository';

/*
try / catch blocks aren't handling when the API can't connect with DB
*/

class CryptoUserRepositoryPG implements ICryptoUserRepository {

    /** Returns list of users's names */
    async listUsers(): Promise<ICryptoListUsersResponse> {
        try {
            const resPG = await PG.query('SELECT user_name FROM users', []);
            const usersList = resPG.rows.map((row) => row.user_name);

            return {
                status: 200,
                usersList
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: `Error getting list of users: ` + err.message
            }
        }
    }

    /** Returns a user's data */
    async getUser( userName: string ): Promise<ICryptoUserResponse> {
        try {
            const resPG = await PG.query('SELECT * FROM users WHERE user_name = $1', [userName]);
            const cryptoUser = new CryptoUser();
            Object.assign(cryptoUser, {
                id: resPG.rows[0].user_id,
                name: resPG.rows[0].user_name,
                isAdmin: resPG.rows[0].isadmin,
                created_at: resPG.rows[0].created_on,
            });
            return {
                status: 200,
                cryptoUser
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: 'Error getting user: ' + err.message  
            }
        }

    }

    /** Creates a new user */
    async createUser( userName: string ): Promise<ICryptoResponse> {
        try {
            const resPG = await PG.query(
                'INSERT INTO users (user_name) VALUES ($1)',
                [userName]
            );
            return {
                status: 201,
                message: userName
            }
        } catch (err) {
            console.log(`Server here - Error creating user ${userName}:`, err);
            return {
                status: 500,
                errorMessage: `Error creating user ${userName}: ` + err.message
            }
        }
    }

    /** Deletes a user */
    async deleteUser( userName: string ): Promise<ICryptoUserResponse> {
        try {
            const resPG = await PG.query('DELETE FROM users WHERE user_name = $1', [userName]);
            return {
                status: 204
            }
        } catch (err) {
            console.log(`Server here - Error deleting user ${userName}:`, err);
            return {
                status: 500,
                errorMessage: `Error deleting user ${userName}: ` + err.message
            }
        }
    }
}

export { CryptoUserRepositoryPG }