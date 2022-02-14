import path from 'path';
import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { ICryptoRepository } from '../../repositories/ICryptoRespository';
import { Response } from 'express' // BAD

interface IRequest {
    user: string;
    res: Response; // BAD
}

class SheetNamesUseCase {
    constructor(private cryptoRepository: ICryptoRepository) {}

    execute({ user, res }: IRequest): void {
        const workbook = new ExcelJS.Workbook();
        
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', user, 'cryptos', 'cryptos.xlsx');

        workbook.xlsx.readFile(pathName).then(() => {
            //const names= [];
            workbook.worksheets.forEach(worksheet => {
                
            });


        }).catch(err => {
            console.error("Server here - error reading .xlsx getting names:", err);
            res.status(500).json({ error: err.message});
        })
    }
}