import { nanoid } from 'nanoid';

//const cryptoNames = ['BTC', 'ETH', 'LTC', 'EOS', 'USDT', 'TUSD', 'USDC', 'PAX', 'BUSD', 'LINK', 'MANA', 'SAND'];

class CryptoPurchase {
    purchase_id: string;
    asset: string;
    date: Date;
    local: string;
    totalBought: number;
    purchaseMediumPrice: number;
    tax: number;
    remainQuant: number;
    newMediumPrice: number;

    constructor() {
        this.purchase_id = nanoid();
    }
}

class CryptoSell {
    sell_id: string;

    // Attributes that are present in the sheet:
    asset: string;
    sellingDate: Date;
    local: string;
    received: string;
    quantSold: number;
    
    // Attributes that are obtained from previous purchases:
    //aquisitionDate: string; // will be ereased
    //aquisitionValue: number; // will be ereased
    //buyIndexes: CryptoSoldLog[]; // will be ereased 
    leftOverQuant: string; // will be ereased

    constructor() {
        this.sell_id = nanoid();
    }
}

interface CryptoPurchaseSellRelation {
    asset: string;
    purchase_id: string;
    sell_id: string;
    quantSold: number;
}

class CryptoPurchasesList {
    assets: Object;
    
    constructor() {
        this.assets = {}
    }

    addPurchase(newPurchase: CryptoPurchase): void {
        if (Object.getOwnPropertyNames(this.assets).includes(newPurchase.asset)) {
            this.assets[newPurchase.asset].push(newPurchase);
        }
        else {
            this.assets[newPurchase.asset] = [];
            this.assets[newPurchase.asset].push(newPurchase);
        }
    }

    presentAssets(): string[] {
        return Object.getOwnPropertyNames(this.assets);
    }
}

class CryptoSellsList {
    assets: Object;
    
    constructor() {
        this.assets = {}
    }

    addSell(newSell: CryptoSell): void {
        if (Object.getOwnPropertyNames(this.assets).includes(newSell.asset)) {
            this.assets[newSell.asset].push(newSell);
        }
        else {
            this.assets[newSell.asset] = [];
            this.assets[newSell.asset].push(newSell);
        }
    }

    presentAssets(): string[] {
        return Object.getOwnPropertyNames(this.assets);
    }
}

class CryptoPurchaseSellList {
    assets: Object;
    
    constructor() {
        this.assets = {}
    }

    addRelation(newRelation: CryptoPurchaseSellRelation): void {
        if (Object.getOwnPropertyNames(this.assets).includes(newRelation.asset)) {
            this.assets[newRelation.asset].push(newRelation);
        }
        else {
            this.assets[newRelation.asset] = [];
            this.assets[newRelation.asset].push(newRelation);
        }
    }

    presentAssets(): string[] {
        return Object.getOwnPropertyNames(this.assets);
    }

    returnAsset(asset: string): CryptoPurchaseSellRelation[] {
        return this.assets[asset];
    } 
}

class CryptoSheet {
    cryptoPurchasesList: CryptoPurchasesList;
    cryptoSellsList: CryptoSellsList;
    cryptoRelationList: CryptoPurchaseSellList;
    sheetName: string;
    created_at: Date;
    lastLine: number;
    id: string;

    constructor() {
        //if (!this.id) this.id = uuidv4();
        this.lastLine = 0;
        this.id = nanoid();
    }
}

class CryptoSummary {
    asset: string;
    totalQuant: number;
    totalValue: number;
}

export { 
    CryptoPurchase,
    CryptoSell,
    CryptoPurchasesList,
    CryptoSellsList,
    CryptoPurchaseSellRelation,
    CryptoPurchaseSellList,
    CryptoSheet,
    CryptoSummary
};