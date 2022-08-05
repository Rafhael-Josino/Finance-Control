import { container } from 'tsyringe';

import { ICryptoUserRepository } from '@modules/accounts/repositories/IAccountRepository';
import { CryptoUserRepositoryPG } from '@modules/accounts/infra/postgresSQL/repositories/AccountRepositoryPG';

import { ICryptoRepository } from '@modules/crypto/repositories/ICryptoRepository';
import { CryptoRepositoryPG } from '@modules/crypto/infra/postgresSQL/repositories/CryptoRepositoryPG';

container.registerSingleton<ICryptoUserRepository> (
    "CryptoUserRepository",
    CryptoUserRepositoryPG
);

container.registerSingleton<ICryptoRepository> (
    "CryptoRepository",
    CryptoRepositoryPG
);
