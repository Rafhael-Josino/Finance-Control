import { CryptoSheet, CryptoSummary } from "../infra/models/Cryptos";
import { SheetListType, PurchaseType, SellType } from "../infra/models/CryptoTypes";

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
type IGetSheetResponse = {
    asset: string;
    purchases: PurchaseType[];
    sells: SellType[];
}

// Repository interface

interface ICryptoRepository {
    listSheets( userID: string ): Promise<SheetListType[]>;
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