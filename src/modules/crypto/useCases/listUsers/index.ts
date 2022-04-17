import { CryptoUserRepositoryPG } from '../../repositories/implementations/CryptoUserRepositoryPG';
import { ListUsersUseCase } from './listUsersUseCase';
import { ListUsersController } from './ListUsersController';

const cryptoUserRepository = new CryptoUserRepositoryPG();
const listUsersUseCase = new ListUsersUseCase(cryptoUserRepository);
const listUsersController = new ListUsersController(listUsersUseCase);

export { listUsersController };
