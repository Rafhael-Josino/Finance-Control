import { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellsList, CryptoSheet } from "../models/Cryptos";
import { Response } from 'express'; // BAD

interface IGetSheetOperationsDTO {
    user: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    user: string;
    cryptoSheetList: CryptoSheet[];
    res: Response; // BAD
}

interface ICryptoRepository {
    getSheetsNames(user: string): string[];
    getSheetOperations({ user, sheetName }: IGetSheetOperationsDTO): any;
    postSheetOperations({ user, cryptoSheetList, res }: IPostSheetOperationsDTO): void;
}

export { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO };