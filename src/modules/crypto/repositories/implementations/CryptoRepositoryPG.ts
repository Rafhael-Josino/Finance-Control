import { PG } from '../../../../database';
import fs from 'fs';
import path from 'path';
import { CryptoSheet } from '../../models/Cryptos';
import { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    ICryptoResponse,
    IPostSheetOperationsResponse
} from '../ICryptoRepository';

class CryptoRepositoryPG implements ICryptoRepository {
    
    // Still using JSON files
    
    getSheet({ userName, sheetName }: IGetSheetOperationsDTO): ICryptoResponse {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const cryptoUser = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheet = cryptoUser.sheets.find((sheet: CryptoSheet) => sheet.sheetName === sheetName);
            return {
                status: 200,
                sheet
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    async postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<IPostSheetOperationsResponse> {

        // tests
        try {
            const res = await PG.query('SELECT $1::text as message', ['Hello world!']);
            console.log(res.rows[0].message) // Hello world!
            
            const test1 = await  PG.query('SELECT datname FROM pg_database', []);
            test1.rows.forEach((row) => console.log(row.message));
            //const test1 = await PG.query('CREATE DATABASE databaseTest', []);
            return {
                status: 500,
                errorMessage: "not ready"
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: "not ready with error: " + err.message
            }
        }

    }
}

export { CryptoRepositoryPG }