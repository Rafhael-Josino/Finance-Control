import { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellsList, CryptoSheet } from "../models/Cryptos";
import { Response } from 'express'; // BAD

interface IGetSheetNamesDTO {
    userName: string;
    res: Response; // BAD
}

interface IGetSheetOperationsDTO {
    userName: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    userName: string;
    cryptoSheetList: CryptoSheet[];
    res: Response; // BAD
}

interface ICryptoRepository {
    getSheetOperations({ userName, sheetName }: IGetSheetOperationsDTO): any;
    postSheetOperations({ userName, cryptoSheetList, res }: IPostSheetOperationsDTO): void;
}

export { IGetSheetNamesDTO, ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO };