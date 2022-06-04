import { v4 as uuidv4 } from 'uuid';
import { CryptoSheet } from './Cryptos';

// sheets can be abstracted to any data and the User functions transported to a separeted module
class CryptoUser {
    id?: string;
    name: string;
    created_at: Date;
    sheets: CryptoSheet[];

    constructor() {
        if (!this.id) this.id = uuidv4();
        this.sheets = [];
    }
}

export { CryptoUser };