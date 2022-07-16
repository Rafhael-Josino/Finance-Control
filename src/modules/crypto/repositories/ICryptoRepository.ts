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

interface ICryptoResponse {
    status: number;
    sheet?: CryptoSheet;
    errorMessage?: string;
}

interface ICryptoAsset {
    status: number;
    assetOperations?: Object;
    errorMessage?: string;
}

interface ICryptoListSheetsResponse {
    status: number;
    sheetList?: string[];
    errorMessage?: string;
}

interface ICryptoSummary {
    status: number;
    sheetSummary?: CryptoSummary[];
    errorMessage?: string;
}

interface IPostSheetOperationsResponse {
    status: number;
    sheetsList?: string[];
    errorMessage?: string;
}

interface IDeleteResponse {
    status: number;
    message: string;
}

// Repository interface

interface ICryptoRepository {
    getSheet({ userName, sheetName, assetName }: IGetSheetOperationsDTO): Promise<ICryptoAsset>;
    listSheets( userName: string ): Promise<ICryptoListSheetsResponse>;
    getSheetSummary({ userName, sheetName }: IReferenceSheet): Promise<ICryptoSummary>;
    postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<IPostSheetOperationsResponse>;
    deleteSheet({ userName, sheetName }: IReferenceSheet): Promise<IDeleteResponse>;
}

export { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IReferenceSheet,
    ICryptoListSheetsResponse,
    ICryptoResponse,
    IPostSheetOperationsResponse,
    IDeleteResponse,
    ICryptoSummary,
    ICryptoAsset
 };