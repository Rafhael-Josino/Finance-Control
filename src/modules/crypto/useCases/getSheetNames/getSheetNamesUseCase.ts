import path from 'path';
import ExcelJS from 'exceljs';
import { Response } from 'express' // BAD

interface IRequest {
    user: string;
    res: Response; // BAD
}

class GetSheetNamesUseCase {
    constructor() {}

    execute({ user, res}: IRequest) {
        const workbook = new ExcelJS.Workbook();
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', user, 'cryptos.xlsx');

        workbook.xlsx.readFile(pathName).then(() => {
            const namesList = [];

            workbook.worksheets.forEach(worksheet => {
                namesList.push(worksheet.name);
            });

            res.send(JSON.stringify(namesList));
        }).catch(err => {
            console.error("Server here - error reading .xlsx getting names:", err);
            res.status(500).json({ error: err.message});
        });
    }
}

export { GetSheetNamesUseCase };