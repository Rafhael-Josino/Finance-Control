import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CryptoUser } from '../../models/CryptoUser';
import {
    ICryptoUserRepository,
    ICryptoListUsersResponse,
    ICryptoUserResponse,
    ICryptoResponse
} from '../ICryptoUserRepository';


class CryptoUserRepositoryJSON implements ICryptoUserRepository {
    
    /** Returns list of users */
    async listUsers(): Promise<ICryptoListUsersResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos');

        try {
            const dirFiles = fs.readdirSync(pathName, 'utf8');
            const filesFilter = new RegExp('\\w+.json');
            const jsonFiles = dirFiles.filter(file => file.match(filesFilter));
            return {
                status: 200,
                usersList: jsonFiles
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: `Error reading directory: ` + err.message
            }
        }
    }

    /** Returns user's data */
    async getUser( userName: string): Promise<ICryptoUserResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const data = fs.readFileSync(pathName, 'utf8');

            console.log(`Sending ${userName}.json`);
            return {
                status: 200,
                //cryptoUser: data // fix this part -> parse the string onto the CryptoUser custom object
            }           
        } catch (err) {
            console.log("Server here - unable to read file:", `${userName}.json` , err);
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    /** Creates a new user */
    async createUser( userName: string ): Promise<ICryptoResponse> {
        const cryptoUser = new CryptoUser();
        Object.assign(cryptoUser, {
            id: uuidv4(),
            name: userName,
            created_at: new Date(),
        });

        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        
        try {
            fs.writeFileSync(pathName, JSON.stringify(cryptoUser));
            console.log(`${userName}.json written successfully`);
            return {
                status: 201,
                message: userName
            }
        } catch (err) {
            console.log(`Server here - Error writting ${userName}.json file:`, err);
            return {
                status: 500,
                errorMessage: `Error writting ${userName}.json file: ` + err.message
            }
        }
    } 
    
    async deleteUser( userName: string ): Promise<ICryptoUserResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        
        try {
            fs.unlinkSync(pathName);
            return {
                status: 204,
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: `Unable to delete user ${userName}: ` + err.message 
            }
        }
    }
}

export { CryptoUserRepositoryJSON }