import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { ICryptoRepository, ISheetOperationsDTO } from './ICryptoRespository';

// parser is a service, should be called by the routes
// the repository functions should be subtypes
import { readWorkSheet } from '../services/parser'; // adapt parser to TS / solve assynchrony


class CryptoRepository implements ICryptoRepository {
    getSheetsNames(user: string): string[] {
        const pathName = path.join(__dirname, '..', '..', "cryptoLogs", user, "cryptos.xlsx");
	    const workbook = new ExcelJS.Workbook();
	
        workbook.xlsx.readFile(pathName).then(() => {
            if (workbook.worksheets.length > 0) {
                const namesList = [];
                workbook.worksheets.forEach(sheet => namesList.push(sheet.name));
                return namesList;
            }
            else {
                return [];
            }
        }).catch(err => {
            console.log("Error reading file:", err.message);
            return ["Error", err.message];
        })
        return ['Error'];
    }

    getSheetOperations({ user, sheetNumber }: ISheetOperationsDTO): any {
        const pathName = path.join(__dirname, '..', "cryptoLogs", user, `sheet${sheetNumber}.json`);

	    fs.readFile(pathName, 'utf8', (err, data) => {
            if (err) {
                console.log("Error reading cryptos file:", err);
                console.log("Attempting to create file from cryptos.xlsx:");
                return readWorkSheet(user, sheetNumber, fs, path, ExcelJS); // adapt parser to TS / solve assynchrony
            }
            else {
                console.log("Sending:", pathName);
                return data;
            }
        });
    }

    putSheetOperations({ user, sheetNumber }: ISheetOperationsDTO): any{
        return readWorkSheet(user, sheetNumber, fs, path, ExcelJS); // adapt parser to TS / solve assynchrony
    }

}

export { CryptoRepository }