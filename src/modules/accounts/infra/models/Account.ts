class Account {
    id: string;
    name: string;
    password: string;
    created_at: Date;
    isAdmin: boolean;

    constructor() {
        this.isAdmin = false;
    }
}

export { Account };