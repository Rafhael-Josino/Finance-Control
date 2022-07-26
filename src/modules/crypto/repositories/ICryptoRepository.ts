import { CryptoSheet, CryptoSummary, CryptoPurchase, CryptoSell, CryptoPurchaseSellRelation } from "../models/Cryptos";

// Function arguments types

interface IGetSheetOperationsDTO {
    userName: string;
    sheetName: string;
    assetName: string;
}

interface IReferenceSheet {
    userName: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    userName: string;
    cryptoSheetList: CryptoSheet[];
}

// Function return types

interface IGetSheetResponse {
    purchases: any[];
    sells: any[];
}

// Repository interface

interface ICryptoRepository {
    getSheet({ userName, sheetName, assetName }: IGetSheetOperationsDTO): Promise<IGetSheetResponse>;
    listSheets( userName: string ): Promise<string[]>;
    getSheetSummary({ userName, sheetName }: IReferenceSheet): Promise<CryptoSummary[]>;
    postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<string[]>;
    deleteSheet({ userName, sheetName }: IReferenceSheet): Promise<void>;
}

export { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IReferenceSheet,
    IGetSheetResponse
 };