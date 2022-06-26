import fs from 'fs';
import path from 'path';
import { 
    CryptoPurchase,
    CryptoSell,
    CryptoPurchaseSellRelation,
    CryptoSheet,
    CryptoSummary 
} from '../../models/Cryptos';
import { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IGetAssetDTO,
    ICryptoResponse,
    IPostSheetOperationsResponse,
    ICryptoSummary,
    IDeleteResponse,
    ICryptoAsset
} from '../ICryptoRepository';

// parser is a service, should be called by the routes
// the repository functions should be subtypes

class CryptoRepositoryJSON implements ICryptoRepository {
    async getSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const cryptoUser = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheet = cryptoUser.sheets.find((sheet: CryptoSheet) => sheet.sheetName === sheetName);
            if (!sheet) {
                return {
                    status: 404,
                    errorMessage: `${sheetName} not found`
                }
            }
            return {
                status: 200,
                sheet
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }
    
    async getAsset({ userName, sheetName, assetName}: IGetAssetDTO): Promise<ICryptoAsset> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const cryptoUser = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheet = cryptoUser.sheets.find((sheet: CryptoSheet) => sheet.sheetName === sheetName);
            if (!sheet) {
                return {
                    status: 404,
                    errorMessage: `${sheetName} not found`
                }
            }
            if (assetName in sheet.cryptoPurchasesList.assets) {
                if (assetName in sheet.cryptoSellsList.assets) {
                    return {
                        status: 200,
                        purchases: sheet.cryptoPurchasesList.assets[assetName],
                        sells: sheet.cryptoSellsList.assets[assetName],
                        relations: sheet.cryptoPurchaseSellRelations[assetName]
                    }
                }
                else {
                    return {
                        status: 200,
                        purchases: sheet.cryptoPurchasesList.assets[assetName],
                        sells: [],
                        relations: []
                    }
                }
            }
            return {
                status: 404,
                errorMessage: `${assetName} not present in the sheet ${sheetName}`
            }
        } catch (err) {
            console.log("Error in getAsset from CryptoRepositoryJSON:");
            console.log(err);
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    async getSheetSummary({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoSummary> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        
        try {
            const cryptoUser = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheet = cryptoUser.sheets.find((sheet: CryptoSheet) => sheet.sheetName === sheetName);
            
            if (!sheet) {
                return {
                    status: 404,
                    errorMessage: `${sheetName} not found`
                }
            }
            
            const summary = Object.getOwnPropertyNames(sheet.cryptoPurchasesList.assets).map((asset: string) => {
                return sheet.cryptoPurchasesList.assets[asset].reduce(
                    (cryptoSummary: CryptoSummary, cryptoPurchase: CryptoPurchase) => {
                        return {
                            asset,
                            totalQuant: cryptoSummary.totalQuant + cryptoPurchase.remainQuant,
                            totalValue: cryptoSummary.totalValue + (cryptoPurchase.remainQuant * cryptoPurchase.purchaseMediumPrice)
                        }
                    },
                    {
                        asset,
                        totalQuant: 0,
                        totalValue: 0
                    }
                );
            });

            return {
                status: 200,
                sheetSummary: summary
            }
        } catch (err) {
            console.log("Error in getSheetSummary from CryptoRepositoryJSON:");
            console.log(err);
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    async postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<IPostSheetOperationsResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);
        try {
            const oldData = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            oldData.sheets = cryptoSheetList;
            const newData = JSON.stringify(oldData);
            fs.writeFileSync(pathName, newData);
            const sheetsList = cryptoSheetList.map((sheet: CryptoSheet) => sheet.sheetName)
            return {
                status: 201,
                sheetsList
            }
        } catch (err) {
            console.log("Error in postSheetOperations from CryptoRepositoryJSON:");
            console.log(err);
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    async deleteSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<IDeleteResponse> {
        return 
    }
}

export { CryptoRepositoryJSON }