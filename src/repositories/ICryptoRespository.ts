interface ISheetOperationsDTO {
    user: string;
    sheetNumber: string;
}

interface ICryptoRepository {
    getSheetsNames(user: string): string[];
    getSheetOperations({ user, sheetNumber }: ISheetOperationsDTO);
    putSheetOperations({ user, sheetNumber }: ISheetOperationsDTO);
}

export { ICryptoRepository, ISheetOperationsDTO };