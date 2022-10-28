import Transaction from '../infra/models/Transaction';

interface IPostTransactionDTO {
    description: string;
    value: number;
    date: `${string}/${string}/${string}`;
    userID: string;
}

interface ITransactionRepository {
    saveTransaction({ description, value, date, userID }: IPostTransactionDTO): Promise<Transaction>
    listTransactions(userID: string): Promise<Transaction[]>
}

export { ITransactionRepository, IPostTransactionDTO }