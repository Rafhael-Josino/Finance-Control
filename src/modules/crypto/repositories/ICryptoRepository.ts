import { CryptoSheet } from "../models/Cryptos";

// Function arguments types

interface IGetSheetOperationsDTO {
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

// Repository interface

interface ICryptoRepository {
    getSheet({ userName, sheetName }: IGetSheetOperationsDTO): any;
    postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): ICryptoResponse;
}

export { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO, ICryptoResponse };