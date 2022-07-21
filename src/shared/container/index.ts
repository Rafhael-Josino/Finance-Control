import { container } from 'tsyringe';

import { ICryptoUserRepository } from '../../modules/accounts/repositories/AccountRepository';
import { CryptoUserRepositoryPG } from '../../modules/accounts/repositories/implementations/AccountRepositoryPG';

import { ICryptoRepository } from '../../modules/crypto/repositories/ICryptoRepository';
import { CryptoRepositoryPG } from '../../modules/crypto/repositories/implementations/CryptoRepositoryPG';

container.registerSingleton<ICryptoUserRepository> (
    "CryptoUserRepository",
    CryptoUserRepositoryPG
);

container.registerSingleton<ICryptoRepository> (
    "CryptoRepository",
    CryptoRepositoryPG
);
