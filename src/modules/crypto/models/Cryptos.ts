import { v4 as uuidv4 } from 'uuid';

//const cryptoNames = ['BTC', 'ETH', 'LTC', 'EOS', 'USDT', 'TUSD', 'USDC', 'PAX', 'BUSD', 'LINK', 'MANA', 'SAND'];

class CryptoPurchase {
    asset: string;
    date: Date;
    local: string;
    totalBought: number;
    purchaseMediumPrice: number;
    tax: number;
    remainQuant: number;
    newMediumPrice: number;
}

class CryptoSell {
    // Attributes that are present in the sheet:
    asset: string;
    sellingDate: Date;
    local: string;
    received: string;
    quantSold: number;
    
    // Attributes that are obtained from previous purchases:
    aquisitionDate: string; // will be ereased
    aquisitionValue: number; // will be ereased
    buyIndexes: CryptoSoldLog[]; // will be ereased 
    leftOverQuant: string; // will be ereased
}

// Substituted for CryptoPruchaseSellRelation - delete after validation of the new one
class CryptoSoldLog {
    index: number;
    date: Date;
    quant: number;
    price: number;
}

class CryptoPurchaseSellRelation {
    asset: string;
    purchaseIndex: number;
    sellIndex: number;
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

// Validate new object before delete this one
class CryptoPurchasesList_old {
    BTC: CryptoPurchase[];
    ETH: CryptoPurchase[];
    LTC: CryptoPurchase[];
    EOS: CryptoPurchase[];
    USDT: CryptoPurchase[];
    TUSD: CryptoPurchase[];
    USDC: CryptoPurchase[];
    PAX: CryptoPurchase[];
    BUSD: CryptoPurchase[];
    LINK: CryptoPurchase[];
    MANA: CryptoPurchase[];
    SAND: CryptoPurchase[];
    
    constructor() {
        this.BTC = [];
        this.ETH = [];
        this.LTC = [];
        this.EOS = [];
        this.USDT = [];
        this.TUSD = [];
        this.USDC = [];
        this.PAX = [];
        this.BUSD = [];
        this.LINK = [];
        this.MANA = [];
        this.SAND = [];
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

class CryptoSellsList_old {
    BTC : CryptoSell[];
    ETH : CryptoSell[];
    LTC : CryptoSell[];
    EOS : CryptoSell[];
    USDT: CryptoSell[];
    TUSD: CryptoSell[];
    USDC: CryptoSell[];
    PAX:  CryptoSell[];
    BUSD: CryptoSell[];
    LINK: CryptoSell[];
    MANA: CryptoSell[];
    SAND: CryptoSell[];
    
    constructor() {
        this.BTC = [];
        this.ETH = [];
        this.LTC = [];
        this.EOS = [];
        this.USDT = [];
        this.TUSD = [];
        this.USDC = [];
        this.PAX = [];
        this.BUSD = [];
        this.LINK = [];
        this.MANA = [];
        this.SAND = [];
    }
}

class CryptoPurchaseSellList {
    private assets: Object; // verify this
    
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
    cryptoRelation: CryptoPurchaseSellList;
    sheetName: string;
    created_at: Date;
    id?: string;

    constructor() {
        if (!this.id) this.id = uuidv4();
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
    CryptoSoldLog,
    CryptoPurchasesList,
    CryptoSellsList,
    CryptoPurchaseSellRelation,
    CryptoPurchaseSellList,
    CryptoSheet,
    CryptoSummary
};