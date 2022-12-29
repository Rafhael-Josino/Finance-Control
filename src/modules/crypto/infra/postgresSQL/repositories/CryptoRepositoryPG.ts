import { PG } from '@shared/infra/postgresSQL';
import { 
    CryptoPurchase,
    CryptoPurchaseSellRelation,
    CryptoSell,
    CryptoSheet,
    CryptoSummary 
} from '@modules/crypto/infra/models/Cryptos';
import { 
    ICryptoRepository,
    IGetSheetOperationsDTO,
    IPostSheetOperationsDTO,
    IReferenceSheet,
    IGetSheetResponse
} from '@modules/crypto/repositories/ICryptoRepository';

class CryptoRepositoryPG implements ICryptoRepository {
    async listSheets( userID: string ): Promise<string[]> {
        const PGresponse = await PG.query(
            `SELECT sheet_name FROM sheets 
            WHERE sheet_id IN (SELECT sheet_id FROM sheets WHERE user_id = $1)
            `,
            [userID]
        );

        const sheetList = PGresponse.rows.map(PGelement => PGelement.sheet_name);

        return sheetList;
    }

    async getSheet({ userID, sheetName, assetName}: IGetSheetOperationsDTO): Promise<IGetSheetResponse> {
        const purchases = await PG.query(
            `SELECT
                purchase_id,
                purchase_date,
                purchase_local,
                total_bought,
                purchase_medium_price,
                tax,
                remain_quant
            FROM
                purchases
            WHERE
                sheet_id IN (SELECT sheet_id FROM sheets WHERE sheet_name = $1 AND user_id = $2)
            AND
                asset = $3
            `,
            [sheetName, userID, assetName]
        );

        const sells = await PG.query(
            `SELECT
                sell_id,
                sell_date,
                sell_local,
                quant_sold,
                received
            FROM
                sells
            WHERE 
                sheet_id IN (SELECT sheet_id FROM sheets WHERE sheet_name = $1 AND user_id = $2)
            AND
                asset = $3
            `,
            [sheetName, userID, assetName]
        );
        
        await sells.rows.reduce(
            async (promise, sell_row) => {
                await promise;
                const purchase_sell = await PG.query(
                    `SELECT purchase_id, quant_sold FROM purchase_sell WHERE sell_id = $1`,
                    [sell_row.sell_id]
                    );

                    Object.assign(sell_row, { purchases_sold: purchase_sell.rows });
            },
            Promise.resolve()
        );

        return {
            asset: assetName,
            purchases: purchases.rows,
            sells: sells.rows 
        }
    }

    async getSheetSummary({ userID, sheetName }: IReferenceSheet): Promise<CryptoSummary[]> {
        const summary = await PG.query(
            `SELECT 
                asset,
                SUM (remain_quant) AS total_quant,
                SUM (remain_quant * purchase_medium_price) AS total_value
            FROM 
                purchases
            WHERE
                sheet_id IN (SELECT sheet_id FROM sheets WHERE sheet_name = $1 AND user_id = $2)
            GROUP BY asset;
            `,
            [sheetName, userID]
        );

        return summary.rows;
    }

    async postSheet({ userID, cryptoSheetList }: IPostSheetOperationsDTO): Promise<string[]> {
        function formatDate(date: Date): string {
            date = new Date(date);
            date.setDate(date.getDate() + 1);
            return date.toLocaleDateString("pt-BR");
        }        
    
        await cryptoSheetList.reduce(
            async (promise, cryptoSheet): Promise<void> => {
                await promise;

                // Must insert also user_id
                await PG.query(
                    `INSERT INTO sheets (sheet_name, sheet_id, user_id) VALUES ($1, $2, $3)`,
                    [cryptoSheet.sheetName, cryptoSheet.id, userID]
                );

                await cryptoSheet.cryptoPurchasesList.presentAssets().reduce(
                    async (promise, cryptoAsset): Promise<void> => {
                        await promise;
                        await cryptoSheet.cryptoPurchasesList.assets[cryptoAsset].reduce(
                            async (promise2: Promise<any>, cryptoPurchase: CryptoPurchase): Promise<void> => {
                                await promise2;
                        
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
                                        sheet_id
                                    ) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7, $8, $9, $10)`,
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
                            },
                            Promise.resolve()
                        );
                    },
                    Promise.resolve()
                );
                
                await cryptoSheet.cryptoSellsList.presentAssets().reduce(
                    async (promise, cryptoAsset): Promise<void> => {
                        await promise;
                        await cryptoSheet.cryptoSellsList.assets[cryptoAsset].reduce(
                            async (promise2: Promise<any>, cryptoSell: CryptoSell): Promise<void> => {
                                await promise2;
                        
                                await PG.query(
                                `INSERT INTO sells (
                                    sell_id,
                                    asset,
                                    sell_date,
                                    sell_local,
                                    received,
                                    quant_sold,
                                    sheet_id
                                ) VALUES ($1, $2, TO_DATE($3, 'DD/MM/YYYY'), $4, $5, $6, $7)`,
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
                            },
                            Promise.resolve()
                        );
                    },
                    Promise.resolve(),
                );
                
                await cryptoSheet.cryptoRelationList.presentAssets().reduce(
                    async (promise, cryptoAsset): Promise<void> => {
                        await promise;
                        await cryptoSheet.cryptoRelationList.assets[cryptoAsset].reduce(
                            async (promise2: Promise<any>, cryptoRelation: CryptoPurchaseSellRelation) => {
                                await promise2;

                                await PG.query(
                                    `INSERT INTO purchase_sell (
                                        purchase_id,
                                        sell_id,
                                        quant_sold
                                    ) VALUES ($1, $2, $3)`,
                                    [
                                        cryptoRelation.purchase_id,
                                        cryptoRelation.sell_id,
                                        String(cryptoRelation.quantSold)
                                    ]
                                );
                            },
                            Promise.resolve()
                        );
                    },
                    Promise.resolve()    
                );
            },
            Promise.resolve()
        );
        
        return cryptoSheetList.map((sheet: CryptoSheet) => sheet.sheetName);
    }

    async deleteSheet({ userID, sheetName }: IReferenceSheet): Promise<void> {
        await PG.query(
            `DELETE FROM sheets
            WHERE
                sheet_name = $1
            AND
                sheet_id IN (SELECT sheet_id FROM sheets WHERE user_id = $2);
            `,
            [sheetName, userID]
        );
    }
}

export { CryptoRepositoryPG }