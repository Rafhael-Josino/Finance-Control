import { container } from 'tsyringe';

import { ICryptoUserRepository } from '../../modules/crypto/repositories/ICryptoUserRepository';
import { CryptoUserRepositoryPG } from '../../modules/crypto/repositories/implementations/CryptoUserRepositoryPG';

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
