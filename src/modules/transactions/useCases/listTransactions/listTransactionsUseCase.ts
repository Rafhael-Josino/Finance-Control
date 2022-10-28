import { inject, injectable } from "tsyringe";

import Transaction from "@modules/transactions/infra/models/Transaction";
import { ITransactionRepository } from "@modules/transactions/repositories/ITransactionsRepository";

@injectable()
class ListTransactionsUseCase {
    constructor(
        @inject("TransactionRepository")
        private transactionRepository: ITransactionRepository
    ) {}

    async execute(userID: string): Promise<Transaction[]> {
        return await this.transactionRepository.listTransactions(userID);
    }
}

export { ListTransactionsUseCase }