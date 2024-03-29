export type SheetListType = {
    sheet_name: string;
    created_at: string;
}

export type PurchaseType = {
    purchase_id: string,
    purchase_date: string,
    purchase_local: string,
    total_bought: number,
    purchase_medium_price: number,
    tax: number,
    remain_quant: number,
}

export type PurchaseSold = {
    purchase_id: string,
    quant_sold: number,
    purchase_medium_price: number,
    purchase_date: string,
}

export type SellType = {
    sell_id: string,
    sell_date: string,
    sell_local: string,
    quant_sold: number,
    received: number,
    aquisitionValue: number,
    purchases_sold: PurchaseSold[],
}

export type GroupedSellType = {
    sellDate: string,
    aquisitionValue: number,
    quantSold: number,
    receivedValue: number,
    purchasesSold: PurchaseSold[],
}

export type BinanceAsset = {
    asset: string,
    free: string,
    locked: string,
}