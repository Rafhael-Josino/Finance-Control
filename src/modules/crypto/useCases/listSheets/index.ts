import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { ListSheetsUseCase } from './listSheetsUseCase';
import { GetSheetNamesController } from './listSheetsController';

const cryptoUserRepository = new CryptoUserRepositoryJSON()
const listSheetsUseCase = new ListSheetsUseCase(cryptoUserRepository);
const listSheetsController = new GetSheetNamesController(listSheetsUseCase);

export { listSheetsController };