import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO } from '../ICryptoRespository';

// parser is a service, should be called by the routes
// the repository functions should be subtypes

class CryptoRepositoryJSON implements ICryptoRepository {
    getSheetsNames(user: string): string[] {
        const pathName = path.join(__dirname, '..', '..', 'logs', user, 'cryptos');

        fs.readdir(pathName, (err, files) => {
            if (err) throw err;
            else return files;
        });

        return [];
    }

    getSheetOperations({ user, sheetName }: IGetSheetOperationsDTO): any {
        const pathName = path.join(__dirname, '..', '..', 'logs', user, 'cryptos', `${sheetName}.json`);

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

    postSheetOperations({ user, cryptoSheetList, res }: IPostSheetOperationsDTO): void{
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', user, `${user}Cryptos.json`);

        fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log(`Server here - Error reading: ${user}'s crypto file`, err);
                res.status(500).json({error: err.message}); // BAD
            }
            else {
                const oldData = JSON.parse(data);
                oldData.sheets = cryptoSheetList;
                const newData = JSON.stringify(oldData);
                fs.writeFile(pathName, newData, err => {
                    if (err) {
                        console.log(`Server here - Error reading: ${user}'s crypto file`, err);
                        res.status(500).json({error: err.message}); // BAD
                    }
                    else {
                        console.log(`${user}Cryptos.json written successfully`);
                        res.status(201).send; // BAD
                    }
                });

            }
        })
    }
}

export { CryptoRepositoryJSON }