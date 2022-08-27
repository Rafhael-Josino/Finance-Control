import { ICryptoRepository, IGetSheetOperationsDTO, IGetSheetResponse, IPostSheetOperationsDTO, IReferenceSheet } from "@modules/crypto/repositories/ICryptoRepository";
import { CryptoSheet, CryptoSummary } from "@modules/crypto/infra/models/Cryptos";

class CryptoRepositoryInMemory implements ICryptoRepository {
    cryptoSheets: CryptoSheet[];

    async listSheets(userID: string): Promise<string[]> {
        return
    }

    async getSheet({ userID, sheetName, assetName }: IGetSheetOperationsDTO): Promise<IGetSheetResponse> {
        return
    }

    async getSheetSummary({ userID, sheetName }: IReferenceSheet): Promise<CryptoSummary[]> {   
        const sheet = this.cryptoSheets.filter((sheet: CryptoSheet) => sheet.sheetName === sheetName)
        const purchases = sheet[0].cryptoPurchasesList;
    
        return
    }

    async postSheet({ userID, cryptoSheetList }: IPostSheetOperationsDTO): Promise<string[]> {
        cryptoSheetList.forEach(sheet => {
            Object.assign(sheet, { userID });
            this.cryptoSheets.push(sheet);
        });
        
        return cryptoSheetList.map(sheet => sheet.sheetName);
    }

    async deleteSheet({ userID, sheetName }: IReferenceSheet): Promise<void> {
        
    }
}