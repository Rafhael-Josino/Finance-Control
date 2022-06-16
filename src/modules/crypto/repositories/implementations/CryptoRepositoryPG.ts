import { PG } from '../../../../database';
import { v4 as uuidv4 } from 'uuid';
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
                `SELECT asset,
                    sum (remain_quant) as total_quant,
                    sum (remain_quant * purchase_medium_price) as total_value
                from purchases
                where
                    sheet_id in (select sheet_id from sheets where upload_id = (select upload_id from uploads order by created_at desc limit 1))
                and 
                    sheet_id in (select sheet_id from sheets where sheetname = $1)
                group by asset;
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
            const uploadID = uuidv4();
            /*
            const resUserID = await PG.query('SELECT user_id FROM users WHERE username = $1', [userName]);
            const userID = resUserID.rows[0].user_id;            
            await PG.query('INSERT INTO uploads (upload_id, user_id) VALUES ($1, $2)', [uploadID, userID]);
            */
           
            await PG.query(
               'INSERT INTO uploads (upload_id, user_id) VALUES ($1, (SELECT user_id FROM users WHERE user_name = $2))',
               [uploadID, userName]
            );

            // First testing only with purchases table

            await cryptoSheetList.reduce(
                async (promise, cryptoSheet): Promise<void> => {
                    await promise;
                    const sheetID = uuidv4();

                    console.log("inserting sheet", cryptoSheet.sheetName);

                    await PG.query(
                        'INSERT INTO sheets (sheet_id, upload_id, sheet_name) VALUES ($1, $2, $3)',
                        [sheetID, uploadID, cryptoSheet.sheetName]
                    );
                    // still without order, so the index must be saved in the object beforehand
                    // this repository function has the objetive of solely save the object in the database
                    cryptoSheet.cryptoPurchasesList.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoPurchasesList.assets[cryptoAsset].map(async (cryptoPurchase: CryptoPurchase, index: number) => {
                            
                            console.log("inserting purchase of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                "INSERT INTO purchases (purchase_index, asset, purchase_date, purchase_local, total_bought, purchase_medium_price, tax, remain_quant, new_medium_price, sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7, $8, $9, $10)",
                                [
                                    String(index),
                                    cryptoPurchase.asset,
                                    formatDate(cryptoPurchase.date),
                                    cryptoPurchase.local,
                                    String(cryptoPurchase.totalBought),
                                    String(cryptoPurchase.purchaseMediumPrice),
                                    String(cryptoPurchase.tax),
                                    String(cryptoPurchase.remainQuant),
                                    String(cryptoPurchase.newMediumPrice),
                                    sheetID
                                ]
                            );
                        });
                    });
                    
                    cryptoSheet.cryptoSellsList.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoSellsList.assets[cryptoAsset].map(async (cryptoSell: CryptoSell, index: number) => {
                            
                            console.log("inserting sell of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                "INSERT INTO sells (sell_index, asset, sell_date, sell_local, received, quant_sold, sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7)",
                                [
                                    String(index),
                                    cryptoSell.asset,
                                    formatDate(cryptoSell.sellingDate),
                                    cryptoSell.local,
                                    String(cryptoSell.received),
                                    String(cryptoSell.quantSold),
                                    sheetID
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
}

export { CryptoRepositoryPG }