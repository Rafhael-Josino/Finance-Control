import { CryptoUserRepositoryJSON } from '../../repositories/implementations/CryptoUserRepositoryJSON';
import { GetSheetUseCase } from './getSheetUseCase';
import { GetSheetController} from './getSheetController';

const cryptoUserRepository = new CryptoUserRepositoryJSON();
const getSheetUseCase = new GetSheetUseCase(cryptoUserRepository);
const getSheetController = new GetSheetController(getSheetUseCase);

export { getSheetController };