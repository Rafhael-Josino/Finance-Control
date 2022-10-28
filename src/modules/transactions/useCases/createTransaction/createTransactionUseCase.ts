import { inject, injectable } from "tsyringe";

import Transaction from "@modules/transactions/infra/models/Transaction";
import { ITransactionRepository } from "@modules/transactions/repositories/ITransactionsRepository";

interface IRequest {
    description: string;
    value: number;
    date: `${string}/${string}/${string}`;
    userID: string;
}

@injectable()
class CreateTransactionUseCase {
    constructor(
        @inject("TransactionRepository")
        private transactionRepository: ITransactionRepository
    ) {}

    async execute({ description, value, date, userID }: IRequest): Promise<Transaction> {
        return await this.transactionRepository.saveTransaction({ description, value, date, userID });
    }
}

export { CreateTransactionUseCase }