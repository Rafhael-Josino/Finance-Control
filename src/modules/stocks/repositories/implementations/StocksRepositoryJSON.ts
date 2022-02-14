import fs from 'fs';
import path from 'path';
import { Stock } from '../../models/Stock';
import { IStockGetDTO, IStockOverwriteDTO, IStocksRepository } from '../IStocksRepository';

class StocksRepositoryJSON implements IStocksRepository {
    getStock({ user, stockName }: IStockGetDTO): Stock {
        return null;
    };
    getAllStocks(user: string): Stock[] {
        return null;
    };
    overwriteStock({ user, stocks }: IStockOverwriteDTO): void {
        const data = JSON.stringify(stocks);
        const namePath = path.join('..', 'logs', user, 'stocks.json');
        fs.writeFile(namePath, data, err => {
            if (err) {
                console.log("Write file failed", err);
            }
            else {
                console.log(`${user}/stocks.json written successfully`);
            }
        })
    };
}

export { StocksRepositoryJSON }