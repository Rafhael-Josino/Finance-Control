import { PG } from '../../../../database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { CryptoSheet, CryptoPurchase } from '../../models/Cryptos';
import { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    ICryptoResponse,
    IPostSheetOperationsResponse,
    ICryptoSummary
} from '../ICryptoRepository';

class CryptoRepositoryPG implements ICryptoRepository {
    
    // Still using JSON files
    
    async getSheet({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoResponse> {
        const pathName = path.join(__dirname, '..', '..', '..', '..', '..', 'logs', 'cryptos', `${userName}.json`);

        try {
            const cryptoUser = JSON.parse(fs.readFileSync(pathName, 'utf8'));
            const sheet = cryptoUser.sheets.find((sheet: CryptoSheet) => sheet.sheetName === sheetName);
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

    async getSheetSummary({ userName, sheetName }: IGetSheetOperationsDTO): Promise<ICryptoSummary> {
        return 
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
               'INSERT INTO uploads (upload_id, user_id) VALUES ($1, (SELECT user_id FROM users WHERE username = $2))',
               [uploadID, userName]
            );

            // First testing only with purchases table

            await cryptoSheetList.reduce(
                async (promise, cryptoSheet): Promise<void> => {
                    await promise;
                    const sheetID = uuidv4();

                    console.log("inserting sheet", cryptoSheet.sheetName);

                    await PG.query(
                        'INSERT INTO sheets (sheet_id, upload_id, sheetname) VALUES ($1, $2, $3)',
                        [sheetID, uploadID, cryptoSheet.sheetName]
                    );
                    // still without order, so the index must be saved in the object beforehand
                    // this repository function has the objetive of solely save the object in the database
                    cryptoSheet.cryptoPurchasesList.presentAssets().forEach(async cryptoAsset => {
                        await cryptoSheet.cryptoPurchasesList.assets[cryptoAsset].map(async (cryptoPurchase: CryptoPurchase) => {
                            
                            console.log("inserting purchase of sheet", cryptoSheet.sheetName);

                            await PG.query(
                                "INSERT INTO purchases (purchase_id, asset, purchase_date, purchase_local, total_bought, purchase_medium_price, tax, remain_quant, new_medium_price, sheet_id) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7, $8, $9, $10)",
                                [
                                    uuidv4(),
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
                        })
                    });

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
                errorMessage: "not ready with error: " + err.message
            }
        }

    }
}

export { CryptoRepositoryPG }