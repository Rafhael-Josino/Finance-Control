import ExcelJS from 'exceljs';
import path from 'path';
import { IStocksRepository } from '../repositories/IStocksRepository';

class StockParserService {
    constructor (private stocksRepository: IStocksRepository) {};
    
    execute(user: string): void {
        const workbook = new ExcelJS.Workbook();
        const pathName = path.join('..', 'logs', user, 'stocks.xlsx');
        const stocks = [];

        workbook.xlsx.readFile(pathName).then(() => {
            workbook.worksheets.forEach((worksheet => {
                stocks.push({
                    name: worksheet.getCell('A2'),
                    quantity: worksheet.getCell('B2'),
                    mediumPrice: worksheet.getCell('B4'),
                    created_at: new Date()
                });
            }));

            this.stocksRepository.overwriteStock({ user, stocks })
        })
    }
}