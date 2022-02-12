import { v4 as uuidv4 } from 'uuid';

class Stock {
    name: string;
    quantity: number;
    mediumPrice: number;
    created_at: Date;
    id?: string;

    constructor() {
        if(!this.id) this.id = uuidv4();
    }
}

export { Stock };