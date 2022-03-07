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


class CryptoUserRepositoryJSON implements ICryptoUserRepository {
    listUsers(): ICryptoListUsersResponse {
        const pathName = path.join(__dirname, '..', '..', 'logs', 'cryptos');

        try {
            const dirFiles = fs.readdirSync(pathName, 'utf8');
            return {
                status: 200,
                usersList: dirFiles
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: `Error reading directory: ` + err.message
            }
        }
    }

    getUser({ userName, res }: ICryptoUserRepositoryDTO): void {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Server here - unable to read file:", `${userName}.json` , err);
                res.status(500).json({error: "Server here - unable to read file: " + `${userName}.json ` + err.message});
            }
            else {
                console.log(`Sending ${userName}.json`);
                res.send(data);
            }
        });
    }

    createUser( userName: string ): ICryptoUserResponse {
        const cryptoUser = new CryptoUser();
        Object.assign(cryptoUser, {
            name: userName,
            created_at: new Date(),
        });

        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        
        try {
            fs.writeFileSync(pathName, JSON.stringify(cryptoUser));
            console.log(`${userName}.json written successfully`);
            return {
                status: 201,
                cryptoUser
            }
        } catch (err) {
            console.log(`Server here - Error writting ${userName}.json file:`, err);
            return {
                status: 500,
                errorMessage: `Error writting ${userName}.json file: ` + err.message
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

export { CryptoUserRepositoryJSON }