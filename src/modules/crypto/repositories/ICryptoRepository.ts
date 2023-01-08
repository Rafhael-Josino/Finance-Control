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

// Type of the object relative to a entry of Purchases table
type PurchaseType = {
    purchase_id: string,
    purchase_date: string,
    purchase_local: string,
    total_bought: number,
    purchase_medium_price: number,
    tax: number,
    remain_quant: number,
}

// Type of the object relative to a entry of Purchases_Sells table
type PurchaseSold = {
    purchase_id: string,
    quant_sold: number,
    purchase_medium_price: number,
    purchase_date: string,
}

type SellType = {
    sell_id: string,
    sell_date: string,
    sell_local: string,
    quant_sold: number,
    received: number,
    aquisitionValue: number,
    purchases_sold: PurchaseSold[],
}

type IGetSheetResponse = {
    asset: string;
    purchases: PurchaseType[];
    sells: SellType[];
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