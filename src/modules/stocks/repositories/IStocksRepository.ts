import { Stock } from '../models/Stock';

interface IStockGetDTO {
    user: string;
    stockName: string;
}

interface IStockOverwriteDTO {
    user: string;
    stocks: Stock[];
}

interface IStocksRepository {
    getStock({ user, stockName }: IStockGetDTO): Stock;
    getAllStocks(user: string): Stock[];
    overwriteStock({ user, stocks }: IStockOverwriteDTO): void;
}

export { IStockGetDTO, IStockOverwriteDTO, IStocksRepository };