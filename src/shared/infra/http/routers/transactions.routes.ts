import { Router } from 'express';

// ###################### Middleware #########################
import { AccountVerifications } from '../middlewares/AccountVerificationsPG';

const accountVerifications = new AccountVerifications();

import { CreateTransactionController } from '@modules/transactions/useCases/createTransaction/createTransactionController';
import { ListTransactionsController } from '@modules/transactions/useCases/listTransactions/listTransactionsController';

const createTransactionController = new CreateTransactionController();
const listTransactionsController = new ListTransactionsController();

const transactionRouter = Router();

transactionRouter.use(accountVerifications.verifySession);

transactionRouter.post('/', createTransactionController.handle);

transactionRouter.get('/', listTransactionsController.handle);

export { transactionRouter };