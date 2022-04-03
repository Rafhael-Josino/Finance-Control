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

// parser is a service, should be called by the routes
// the repository functions should be subtypes

class CryptoRepositoryJSON implements ICryptoRepository {
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

    postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): IPostSheetOperationsResponse {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        try {
            const oldData = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            oldData.sheets = cryptoSheetList;
            const newData = JSON.stringify(oldData);
            fs.writeFileSync(pathName, newData);
            const sheetsList = cryptoSheetList.map((sheet: CryptoSheet) => sheet.sheetName)
            return {
                status: 201,
                sheetsList
            }
        } catch (error) {
            console.log("Error in postSheetOperations from CryptoRepositoryJSON:");
            console.log(error);
            return {
                status: 500,
                errorMessage: error.message
            }
        }
    }
}

export { CryptoRepositoryJSON }