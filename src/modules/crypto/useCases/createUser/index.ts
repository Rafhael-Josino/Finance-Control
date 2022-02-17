import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { CreateUserUseCase } from './createUserUseCase';
import { CreateUserController } from './createUserController';

const cryptoUserRepository = new CryptoUserRepositoryJSON();
const createUserUseCase = new CreateUserUseCase(cryptoUserRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
