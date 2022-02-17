import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { GetUserUseCase } from './getUserUseCase';
import { GetUserController } from './getUserController';

const cryptoUserRepository = new CryptoUserRepositoryJSON();
const getUserUseCase = new GetUserUseCase(cryptoUserRepository);
const getUserController = new GetUserController(getUserUseCase);

export { getUserController };
