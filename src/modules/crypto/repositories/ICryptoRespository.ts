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
    message: string;
}

// Repository interface

interface ICryptoRepository {
    getSheetOperations({ userName, sheetName }: IGetSheetOperationsDTO): any;
    postSheetOperations({ userName, cryptoSheetList }: IPostSheetOperationsDTO): ICryptoResponse;
}

export { ICryptoRepository, IGetSheetOperationsDTO, IPostSheetOperationsDTO, ICryptoResponse };