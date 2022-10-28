import { container } from 'tsyringe';

import { IAccountRepository } from '@modules/accounts/repositories/IAccountRepository';
import { AccountRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { UserTokenRepository } from '@modules/accounts/infra/postgresSQL/repositories/UserTokenRepositoryPG';
import { ITransactionRepository } from '@modules/transactions/repositories/ITransactionsRepository';
import { TransactionRepository } from '@modules/transactions/infra/postgresSQL/repositories/TransactionRepositoryPG';

import { ICryptoRepository } from '@modules/crypto/repositories/ICryptoRepository';
import { CryptoRepositoryPG } from '@modules/crypto/infra/postgresSQL/repositories/CryptoRepositoryPG';

import '@shared/container/providers';

container.registerSingleton<IAccountRepository> (
    "AccountRepository",
    AccountRepositoryPG
);

container.registerSingleton<IUserTokenRepository> (
    "UserTokenRepository",
    UserTokenRepository
)

container.registerSingleton<ICryptoRepository> (
    "CryptoRepository",
    CryptoRepositoryPG
);

container.registerSingleton<ITransactionRepository> (
    "TransactionRepository",
    TransactionRepository
)