import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { ListUsersUseCase } from './listUsersUseCase';
import { ListUsersController } from './ListUsersController';

const cryptoUserRepository = new CryptoUserRepositoryJSON();
const listUsersUseCase = new ListUsersUseCase(cryptoUserRepository);
const listUsersController = new ListUsersController(listUsersUseCase);

export { listUsersController };
