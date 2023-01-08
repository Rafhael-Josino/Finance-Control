import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { inject, injectable } from "tsyringe";

// Request type from the Controller
type GetSheetReq = {
    userID: string;
    sheetName: string;
    assetName: string;
    sellShowMode: string;
}

// Types present in the response
type PurchaseType = {
    purchase_id: string,
    purchase_date: string,
    purchase_local: string,
    total_bought: number,
    purchase_medium_price: number,
    tax: number,
    remain_quant: number,
}

type PurchaseSold = {
    purchase_id: string,
    quant_sold: number,
    purchase_medium_price: number,
    purchase_date: string,
}

type SellType = {
    sell_id: string,
    sell_date: string,
    sell_local: string,
    quant_sold: number,
    received: number,
    aquisitionValue: number,
    purchases_sold: PurchaseSold[],
}

type GroupedSellType = {
    sellDate: string,
    aquisitionValue: number,
    quantSold: number,
    receivedValue: number,
    purchasesSold: PurchaseSold[],

}

type GetSheetRes = {
    asset: string,
    purchases: PurchaseType[],
    sells: SellType[] | GroupedSellType[]
    //sells: any,

}

@injectable()
class GetAssetOperationsUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userID, sheetName, assetName, sellShowMode }: GetSheetReq): Promise<GetSheetRes> {
        const assetOperations = await this.cryptoRepository.getSheet({ userID, sheetName, assetName });

        // Editing the sells property if they should be agrouped by month (only the ones with profit)
        if (sellShowMode === 'month') {
            // A Map object is used to help putting together the sells's informations under a same month and year
            const agroupedSellsMap: Map<string, GroupedSellType>  = new Map();

            assetOperations.sells.map((sell: SellType) => {
                if (sell.received >= sell.aquisitionValue) {
                    // sell.sell_date is returned as an object from the databank
                    // the "pieces" bellow correspond to the month and year present after stringfy the object
                    const month_year = String(sell.sell_date).slice(4,7) + " " +
                                       String(sell.sell_date).slice(11,15)
    
                    // Creates a new Grouped Sell object if no sell in this month/year was found before
                    if (!agroupedSellsMap.get(month_year)) {
                        agroupedSellsMap.set(month_year, {
                            sellDate: month_year,
                            aquisitionValue: sell.aquisitionValue,
                            quantSold: sell.quant_sold,
                            receivedValue: sell.received,
                            purchasesSold: [...sell.purchases_sold],
                        });

                    // In the case of existing previous sell from this month, updates the object
                    } else {
                        const { 
                            sellDate,
                            aquisitionValue, 
                            quantSold, 
                            receivedValue,
                            purchasesSold, 
                        } 
                        = agroupedSellsMap.get(month_year);

                        agroupedSellsMap.set(month_year, {
                            sellDate,
                            aquisitionValue: aquisitionValue + sell.aquisitionValue,
                            quantSold: quantSold + sell.quant_sold,
                            receivedValue: receivedValue + sell.received,
                            purchasesSold: [...purchasesSold, ...sell.purchases_sold],
                        })
                    }
                }
            });

            // 
            const groupedSells: GroupedSellType[] = [];
            for (let [, value] of agroupedSellsMap) {
                groupedSells.push(value);
            }

            return {
                asset: assetOperations.asset,
                purchases: assetOperations.purchases,
                sells: groupedSells,
            }
        }

        return assetOperations;
    }
}

export { GetAssetOperationsUseCase };