import fs from 'fs';
import path from 'path';
import { IGetSheetNamesDTO, ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO } from '../ICryptoRespository';

interface ICryptoResponse {
    status: number;
    message: string;
}

// parser is a service, should be called by the routes
// the repository functions should be subtypes

class CryptoRepositoryJSON implements ICryptoRepository {
    getSheetOperations({ userName, sheetName }: IGetSheetOperationsDTO): any {
        const pathName = path.join(__dirname, '..', '..', 'logs', userName, 'cryptos', `${sheetName}.json`);

	    fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Error reading cryptos file:", err);
                console.log("Attempting to create file from cryptos.xlsx:");
                return err;
            }
            else {
                console.log("Sending:", pathName);
                return data;
            }
        });
    }

    postSheetOperations({ userName, cryptoSheetList, res }: IPostSheetOperationsDTO): ICryptoResponse {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        try {
            const oldData = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            oldData.sheets = cryptoSheetList;
            const newData = JSON.stringify(oldData);
            fs.writeFileSync(pathName, newData);
            return {
                status: 201,
                message: `${userName}.json overwritten with success`
            }
        } catch (error) {
            console.log("Error in postSheetOperations from CryptoRepositoryJSON:");
            console.log(error);
            return {
                status: 500,
                message: error.message
            }
        }
    }
}

export { CryptoRepositoryJSON }