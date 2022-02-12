import { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellList } from "../model/Cryptos";

interface IGetSheetOperationsDTO {
    user: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    user: string;
    sheetName: string;
    cryptoPurchasesList: CryptoPurchasesList;
}

interface ICryptoRepository {
    getSheetsNames(user: string): string[];
    getSheetOperations({ user, sheetName }: IGetSheetOperationsDTO): any;
    postSheetOperations({ user, sheetName, cryptoPurchasesList }: IPostSheetOperationsDTO): void;
}

export { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO };