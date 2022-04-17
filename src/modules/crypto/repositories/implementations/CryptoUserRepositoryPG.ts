import { PG } from '../../../../database';
import fs from 'fs';
import path from 'path';
import { CryptoUser } from '../../models/CryptoUser';
import {
    ICryptoUserRepository,
    ICryptoUserRepositoryDTO,
    ICryptoListSheetsResponse,
    ICryptoListUsersResponse,
    ICryptoUserResponse
} from '../ICryptoUserRepository';

/*
try / catch blocks aren't handling when the API can't connect with DB
*/

class CryptoUserRepositoryPG implements ICryptoUserRepository {
    async listUsers(): Promise<ICryptoListUsersResponse> {
        try {
            const resPG = await PG.query('SELECT username FROM users', []);
            const usersList = resPG.rows.map((row) => row.username);

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
            const resPG = await PG.query('SELECT * FROM users WHERE username = $1', [userName]);
            return {
                status: 200,
                cryptoUser: {
                    id: resPG.rows[0].user_id,
                    name: resPG.rows[0].username,
                    created_at: resPG.rows[0].created_on,
                    sheets: []
                }
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: 'Error getting user: ' + err.message  
            }
        }

    }

    async createUser( userName: string ): Promise<ICryptoUserResponse> {
        const cryptoUser = new CryptoUser();
        Object.assign(cryptoUser, {
            name: userName,
            created_at: new Date(),
        });

        try {
            const resPG = await PG.query(
                'INSERT INTO users (user_id, username, created_on) VALUES ($1, $2, $3)',
                [cryptoUser.id, cryptoUser.name, JSON.stringify(cryptoUser.created_at)]
            );
            return {
                status: 201,
                cryptoUser
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
}

export { CryptoUserRepositoryPG }