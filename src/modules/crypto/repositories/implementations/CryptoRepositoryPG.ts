import { PG } from '../../../../database';
//import { v4 as uuidv4 } from 'uuid';
//import { nanoid } from 'nanoid';
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
    IDeleteResponse,
    ICryptoSummary,
    ICryptoAsset
} from '../ICryptoRepository';

class CryptoRepositoryPG implements ICryptoRepository {
    async getSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoResponse> {
        return
    }

    async getAsset({ userName, sheetName, assetName}: IGetAssetDTO): Promise<ICryptoAsset> {
        return 
    }

    async getSheetSummary({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoSummary> {
        try {
            const summary = await PG.query(
                // FIX query bellow
                `SELECT asset,
                    SUM (remain_quant) AS total_quant,
                    SUM (remain_quant * purchase_medium_price) AS total_value
                FROM purchases
                WHERE
                    sheet_id IN (SELECT sheet_id FROM sheets WHERE sheet_name = $1)
                GROUP BY asset;
                `,
                [sheetName]
            );

            return {
                status: 200,
                sheetSummary: summary.rows
            }
        } catch (err) {
            console.log("Error in getsummary from CryptoRepositoryPG:");
            console.log(err);
            return {
                status: 500,
                errorMessage: err.message
            }
        }
    }

    async postSheet({ userName, cryptoSheetList }: IPostSheetOperationsDTO): Promise<IPostSheetOperationsResponse> {
        function formatDate(date: Date): string {
            date = new Date(date);
            date.setDate(date.getDate() + 1);
            return date.toLocaleDateString("pt-BR");
        }        
        
        try {
            /*
            const resUserID = await PG.query('SELECT user_id FROM users WHERE username = $1', [userName]);
            const userID = resUserID.rows[0].user_id;            
            await PG.query('INSERT INTO uploads (upload_id, user_id) VALUES ($1, $2)', [uploadID, userID]);
            */
           
            await cryptoSheetList.reduce(
                async (promise, cryptoSheet): Promise<void> => {
                    await promise;

                    console.log("Inserting sheet", cryptoSheet.sheetName);

                    // Must insert also user_id
                    await PG.query(
                        'INSERT INTO sheets (sheet_id, sheet_name) VALUES ($1, $2)',
                        [cryptoSheet.id, cryptoSheet.sheetName]
                    );

                    cryptoSheet.cryptoPurchasesList.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoPurchasesList.assets[cryptoAsset].map(async (cryptoPurchase: CryptoPurchase, index: number) => {
                            
                            console.log("inserting purchase of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                `INSERT INTO purchases (
                                    purchase_id,
                                    asset,
                                    purchase_date,
                                    purchase_local,
                                    total_bought,
                                    purchase_medium_price,
                                    tax,
                                    remain_quant,
                                    new_medium_price,
                                    sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7, $8, $9, $10)`,
                                [
                                    cryptoPurchase.purchase_id,
                                    cryptoPurchase.asset,
                                    formatDate(cryptoPurchase.date),
                                    cryptoPurchase.local,
                                    String(cryptoPurchase.totalBought),
                                    String(cryptoPurchase.purchaseMediumPrice),
                                    String(cryptoPurchase.tax),
                                    String(cryptoPurchase.remainQuant),
                                    String(cryptoPurchase.newMediumPrice),
                                    cryptoSheet.id
                                ]
                            );
                        });
                    });
                    
                    cryptoSheet.cryptoSellsList.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoSellsList.assets[cryptoAsset].map(async (cryptoSell: CryptoSell, index: number) => {
                            
                            console.log("inserting sell of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                `INSERT INTO sells (
                                    sell_id,
                                    asset,
                                    sell_date,
                                    sell_local,
                                    received,
                                    quant_sold,
                                    sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7)`,
                                [
                                    cryptoSell.sell_id,
                                    cryptoSell.asset,
                                    formatDate(cryptoSell.sellingDate),
                                    cryptoSell.local,
                                    String(cryptoSell.received),
                                    String(cryptoSell.quantSold),
                                    cryptoSheet.id
                                ]
                            );
                        });
                    });
                    /*
                    cryptoSheet.cryptoRelation.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoSellsList.assets[cryptoAsset].map(async (cryptoRelation: CryptoPurchaseSellRelation) => {
                            
                            console.log("inserting relation between purchase and sell of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                "INSERT INTO sells (sell_id, asset, sell_date, sell_local, received, quant_sold, sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7)",
                                [            
                                ]
                            );
                        });
                    });
                    */
                    console.log('after insert data in DB');
                    //cryptoSheet.cryptoSellList.presentAssets().forEach(as)
                },
                Promise.resolve()
            );
            
            const sheetsList = cryptoSheetList.map((sheet: CryptoSheet) => sheet.sheetName)
            return {
                status: 201,
                sheetsList
            }
        } catch (err) {
            return {
                status: 500,
                errorMessage: "Crypto Repository PG (post sheet) here - internal error: " + err.message
            }
        }

    }

    async deleteSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<IDeleteResponse> {
        try {
            await PG.query(
                `DELETE FROM sheets
                WHERE
                    sheet_name = $1
                AND
                    sheet_id IN (SELECT sheet_id FROM sheets WHERE 
                        user_id = (SELECT user_id FROM users WHERE user_name = $2));
                `,
                [sheetName, userName]
            );

            return {
                status: 204,
                message: `Sheet ${sheetName} from user ${userName} deleted`
            }
        } catch(err) {
            console.log("Error in Delete Sheet from CryptoRepositoryPG:");
            console.log(err);
            return {
                status: 500,
                message: err.message
            }
        }
    }
}

export { CryptoRepositoryPG }