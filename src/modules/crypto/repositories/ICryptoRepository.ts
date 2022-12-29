import { CryptoSheet, CryptoSummary } from "../infra/models/Cryptos";

// Function arguments types

interface IGetSheetOperationsDTO {
    userID: string;
    sheetName: string;
    assetName: string;
}

interface IReferenceSheet {
    userID: string;
    sheetName: string;
}

interface IPostSheetOperationsDTO {
    userID: string;
    cryptoSheetList: CryptoSheet[];
}

// Function return types

interface IGetSheetResponse {
    asset: string;
    purchases: any[];
    sells: any[];
}

// Repository interface

interface ICryptoRepository {
    listSheets( userID: string ): Promise<string[]>;
    getSheet({ userID, sheetName, assetName }: IGetSheetOperationsDTO): Promise<IGetSheetResponse>;
    getSheetSummary({ userID, sheetName }: IReferenceSheet): Promise<CryptoSummary[]>;
    postSheet({ userID, cryptoSheetList }: IPostSheetOperationsDTO): Promise<string[]>;
    deleteSheet({ userID, sheetName }: IReferenceSheet): Promise<void>;
}

export { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IReferenceSheet,
    IGetSheetResponse
 };