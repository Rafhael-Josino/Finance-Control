import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { ListSheetsUseCase } from './listSheetsUseCase';
import { ListSheetsController } from './listSheetsController';

const cryptoUserRepository = new CryptoUserRepositoryJSON()
const listSheetsUseCase = new ListSheetsUseCase(cryptoUserRepository);
const listSheetsController = new ListSheetsController(listSheetsUseCase);

export { listSheetsController };