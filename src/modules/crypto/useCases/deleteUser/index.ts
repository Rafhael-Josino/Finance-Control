import { CryptoUserRepositoryPG } from '../../repositories/implementations/CryptoUserRepositoryPG';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { DeleteUserController } from './deleteUserController';

const cryptoUserRepository = new CryptoUserRepositoryPG();
const deleteUserUseCase = new DeleteUserUseCase(cryptoUserRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserController };
