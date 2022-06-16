import { CryptoSheet } from './Cryptos';

// sheets can be abstracted to any data and the User functions transported to a separeted module
class CryptoUser {
    id: string;
    name: string;
    created_at: Date;
    sheets: CryptoSheet[];

    constructor() {
        this.sheets = [];
    }
}

export { CryptoUser };