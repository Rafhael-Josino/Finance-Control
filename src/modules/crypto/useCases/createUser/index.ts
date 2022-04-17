import { CryptoUserRepositoryPG } from '../../repositories/implementations/CryptoUserRepositoryPG';
import { CreateUserUseCase } from './createUserUseCase';
import { CreateUserController } from './createUserController';

const cryptoUserRepository = new CryptoUserRepositoryPG();
const createUserUseCase = new CreateUserUseCase(cryptoUserRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
