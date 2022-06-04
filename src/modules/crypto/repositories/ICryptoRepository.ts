import { CryptoSheet, CryptoSummary, CryptoPurchase, CryptoSell, CryptoPurchaseSellRelation } from "../models/Cryptos";

// Function arguments types

interface IGetSheetOperationsDTO {
    userName: string;
    sheetName: string;
}

interface IGetAssetDTO {
    userName: string;
    sheetName: string;
    assetName: string;
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
    purchases?: CryptoPurchase[];
    sells?: CryptoSell[]
    relations?: CryptoPurchaseSellRelation[];
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

// Repository interface

interface ICryptoRepository {
    getSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoResponse>;
    getAsset({ userName, sheetName, assetName}: IGetAssetDTO): Promise<ICryptoAsset>;
    getSheetSummary({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoSummary>;
    postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<IPostSheetOperationsResponse>;
}

export { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IGetAssetDTO,
    ICryptoResponse,
    IPostSheetOperationsResponse,
    ICryptoSummary,
    ICryptoAsset
 };