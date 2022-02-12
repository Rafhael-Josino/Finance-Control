import { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellList } from "../models/Cryptos";
import { Response } from 'express'; // BAD

interface IGetSheetOperationsDTO {
    user: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    user: string;
    sheetName: string;
    cryptoPurchasesList: CryptoPurchasesList;
    res: Response; // BAD
}

interface ICryptoRepository {
    getSheetsNames(user: string): string[];
    getSheetOperations({ user, sheetName }: IGetSheetOperationsDTO): any;
    postSheetOperations({ user, sheetName, cryptoPurchasesList, res }: IPostSheetOperationsDTO): void;
}

export { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO };