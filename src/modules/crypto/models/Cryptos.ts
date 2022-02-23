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
    aquisitionValue: number;
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

class CryptoSheet {
    cryptoPurchasesList: CryptoPurchasesList;
    cryptoSellList: CryptoSellsList;
    sheetName: string;
    created_at: Date;
    id?: string;

    constructor() {
        if (!this.id) this.id = uuidv4();
    }
}

export { CryptoPurchase, CryptoSell, CryptoSoldLog, CryptoPurchasesList, CryptoSellsList, CryptoSheet };