import { ICryptoRepository } from '../../repositories/ICryptoRepository';
import { inject, injectable } from "tsyringe";

// Request type from the Controller
type GetSheetReq = {
    userID: string;
    sheetName: string;
    assetName: string;
    sellsMonthlyResumed: string;
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

type AgroupedSellType = {
    sell_date: string,
    aquisitionValue: number,
    quantSold: number,
    receivedValue: number,
}

type GetSheetRes = {
    asset: string,
    purchases: PurchaseType[],
    sells: SellType[] | AgroupedSellType[]
    //sells: any,

}

@injectable()
class GetSheetUseCase {
    constructor(
        @inject("CryptoRepository")
        private cryptoRepository: ICryptoRepository
    ) {}

    async execute({ userID, sheetName, assetName, sellsMonthlyResumed }: GetSheetReq): Promise<GetSheetRes> {
        const assetOperations = await this.cryptoRepository.getSheet({ userID, sheetName, assetName });

        // Editing the sells property if they should be agrouped by month (only the ones with profit)
        if (sellsMonthlyResumed === 'yes') {
            // A Map object is used to help putting together the sells's informations under a same month and year
            const agroupedSellsMap = new Map();

            assetOperations.sells.map((sell: SellType) => {
                if (sell.received >= sell.aquisitionValue) {
                    // sell.sell_date is returned as an object from the databank
                    // the "pieces" bellow correspond to the month and year present after stringfy the object
                    const month_year = String(sell.sell_date).slice(4,7) +
                                       String(sell.sell_date).slice(11,15)
    
                    if (!agroupedSellsMap.get(month_year)) {
                        agroupedSellsMap.set(month_year, {
                            aquisitionValue: sell.aquisitionValue,
                            quantSold: sell.quant_sold,
                            receivedValue: sell.received,
                        });
                    } else {
                        const { aquisitionValue, quantSold, receivedValue } = agroupedSellsMap.get(month_year);
                        agroupedSellsMap.set(month_year, {
                            aquisitionValue: aquisitionValue + sell.aquisitionValue,
                            quantSold: quantSold + sell.quant_sold,
                            receivedValue: receivedValue + sell.received,
                        })
                    }
                }
            });

            // After the information is agrouped, a new array of objects is made to be returned
            const agroupedSells: AgroupedSellType[] = [];
            for (let [key, value] of agroupedSellsMap) {
                agroupedSells.push({
                    sell_date: key,
                    aquisitionValue: value.aquisitionValue,
                    quantSold: value.quantSold,
                    receivedValue: value.receivedValue,
                })
            }

            return {
                asset: assetOperations.asset,
                purchases: assetOperations.purchases,
                sells: agroupedSells,
            }
        }

        return assetOperations;
    }
}

export { GetSheetUseCase };