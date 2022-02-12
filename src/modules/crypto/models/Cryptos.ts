import { v4 as uuidv4 } from 'uuid';

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
    sellingDate: Date;
    asset: string;
    local: string;
    received: string;
    quantSold: string;

    // Attributes that are obtained from previous purchases:
    aquisitionDate: string;
    aquisitionValue: string;
    buyIndexes: CryptoSoldLog[];
    leftOverQuant: string;
}

class CryptoSoldLog {
    index: number;
    date: Date;
    quant: number;
    price: number;
}

class CryptoPurchasesList {
    BTC: CryptoPurchase[];
    ETH: CryptoPurchase[];
    LTC: CryptoPurchase[];
    EOS: CryptoPurchase[];
    USDT: CryptoPurchase[];
    TUSD: CryptoPurchase[];
    USDC: CryptoPurchase[];
    PAX: CryptoPurchase[];
    BUSD: CryptoPurchase[];

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
    }
    
}

class CryptoSellList {
    BTC : CryptoSell[];
    ETH : CryptoSell[];
    LTC : CryptoSell[];
    EOS : CryptoSell[];
    USDT: CryptoSell[];
    TUSD: CryptoSell[];
    USDC: CryptoSell[];
    PAX:  CryptoSell[];
    BUSD: CryptoSell[];

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
    }
}

export { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellList };