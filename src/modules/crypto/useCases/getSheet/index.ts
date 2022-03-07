import { CryptoRepositoryJSON } from '../../repositories/implementations/CryptoRepositoryJSON';
import { GetSheetUseCase } from './getSheetUseCase';
import { GetSheetController} from './getSheetController';

const cryptoRepository = new CryptoRepositoryJSON();
const getSheetUseCase = new GetSheetUseCase(cryptoRepository);
const getSheetController = new GetSheetController(getSheetUseCase);

export { getSheetController };