import { PG } from "@shared/infra/postgresSQL";
import Transaction from "@modules/transactions/infra/models/Transaction";
import { ITransactionRepository, IPostTransactionDTO } from "@modules/transactions/repositories/ITransactionsRepository";

class TransactionRepository implements ITransactionRepository {
    async saveTransaction({ description, value, date, userID }: IPostTransactionDTO): Promise<Transaction> {
        const newTransaction = new Transaction();
        await PG.query(
            `INSERT INTO transactions (
                user_id,
                transaction_description,
                transaction_value,
                transaction_date
            ) VALUES ($1, $2, $3, TO_DATE($4, 'DD/MM/YYYY'))`, 
            [
                userID,
                description,
                String(value),
                date,
            ])
        
        Object.assign(newTransaction, {
            transaction_description: description,
            transaction_value: value,
            transaction_date: date,
        });
        
        return newTransaction;
    }
    
    async listTransactions(userID: string): Promise<Transaction[]> {
        const PGresponse = await PG.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [userID]
        );
            
        return PGresponse.rows.map((row: any) => {
            const transaction = new Transaction();
            return Object.assign(transaction, {
                transaction_description: row.transaction_description,
                transaction_value: row.transaction_value,
                transaction_date: row.transaction_date,
            });
        });
    }
}

export { TransactionRepository };