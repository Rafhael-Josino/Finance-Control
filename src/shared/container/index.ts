import { container } from 'tsyringe';
import { ICryptoUserRepository } from '../../modules/crypto/repositories/ICryptoUserRepository';
import { CryptoUserRepositoryPG } from '../../modules/crypto/repositories/implementations/CryptoUserRepositoryPG';

container.registerSingleton<ICryptoUserRepository> (
    "CryptoUserRepository",
    CryptoUserRepositoryPG
);