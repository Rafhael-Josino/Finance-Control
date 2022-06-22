import { PG } from '../../../../database';
import fs from 'fs';
import path from 'path';
import { CryptoUser } from '../../models/CryptoUser';
import {
    ICryptoUserRepository,
    ICryptoListSheetsResponse,
    ICryptoListUsersResponse,
    ICryptoUserResponse,
    ICryptoResponse
} from '../ICryptoUserRepository';

/*
try / catch blocks aren't handling when the API can't connect with DB
*/

class CryptoUserRepositoryPG implements ICryptoUserRepository {
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

    async getUser( userName: string): Promise<ICryptoUserResponse> {
        try {
            const resPG = await PG.query('SELECT * FROM users WHERE user_name = $1', [userName]);
            const cryptoUser = new CryptoUser();
            Object.assign(cryptoUser, {
                id: resPG.rows[0].user_id,
                name: resPG.rows[0].user_name,
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

    listSheets( userName: string ): ICryptoListSheetsResponse {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const userData = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheetNames = userData.sheets.map((sheet: any) => sheet.sheetName);
            console.log(`Server here - Sending ${userName}.json's sheet names`);
            return {
                status: 200,
                sheetsList: sheetNames
            }
        } catch (err) {
            console.log("Server here - unable to read file:", `${userName}.json` , err);
            return {
                status: 500,
                errorMessage: `Unable to read file ${userName}.json: ` + err.message
            }
        }
    }

    async deleteUser( userName: string ): Promise<ICryptoUserResponse> {
        try {
            const resPG = await PG.query('DELETE FROM users WHERE userName = $1', [userName]);
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