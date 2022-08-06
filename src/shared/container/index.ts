import { container } from 'tsyringe';

import { IAccountRepository } from '@modules/accounts/repositories/IAccountRepository';
import { AccountRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';

import { ICryptoRepository } from '@modules/crypto/repositories/ICryptoRepository';
import { CryptoRepositoryPG } from '@modules/crypto/infra/postgresSQL/repositories/CryptoRepositoryPG';

container.registerSingleton<IAccountRepository> (
    "AccountRepository",
    AccountRepositoryPG
);

container.registerSingleton<ICryptoRepository> (
    "CryptoRepository",
    CryptoRepositoryPG
);
